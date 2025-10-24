const axios = require('axios');
const cheerio = require('cheerio');

function normalizeItems(items) {
	return items
		.filter(Boolean)
		.map((it) => ({
			videoId: it.videoId,
			title: it.title,
			thumbnail: it.thumbnail,
		}))
		.filter((v) => v.videoId && v.title);
}

// ---------- Scrape (unofficial) implementations ONLY ----------
function extractTitleFromHtml(html) {
	const $ = cheerio.load(html);
	const raw = $('title').text() || '';
	return raw.replace(/\s*-\s*YouTube\s*$/i, '').trim();
}

async function scrapeGetById(videoId) {
	const resp = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
	const title = extractTitleFromHtml(resp.data);
	const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
	return { status: 'ok', data: [{ videoId, title, thumbnail }] };
}

async function scrapeSearch(query) {
	// Note: This relies on an internal web API and may break at any time.
	const payload = {
		context: {
			client: {
				clientName: 'WEB',
				clientVersion: '2.20210628.06.00-canary_experiment',
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36,gzip(gfe)',
			},
		},
		query,
	};

	const { data } = await axios.post(
		'https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
		payload,
		{
			headers: {
				'x-origin': 'https://www.youtube.com',
				origin: 'https://www.youtube.com',
				'content-type': 'application/json',
			},
		}
	);

	const results =
		data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

	const mapped = results
		.map((r) => {
			try {
				const v = r.videoRenderer;
				return {
					videoId: v.videoId,
					title: v.title?.runs?.[0]?.text,
					thumbnail: v.thumbnail?.thumbnails?.[0]?.url,
				};
			} catch (_e) {
				return null;
			}
		})
		.filter(Boolean);

	return { status: 'ok', data: normalizeItems(mapped) };
}

	// ---------- Public API (scrape-only) ----------
exports.search = async (q) => {
	if (!q || !q.trim()) return { status: 'ok', data: [] };
	try {
		return await scrapeSearch(q.trim());
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('YouTube search failed:', err?.message || err);
		return { status: 'fail', message: 'YouTube search failed' };
	}
};

exports.getById = async (videoId) => {
	if (!videoId) return { status: 'fail', message: 'videoId required' };
	try {
		return await scrapeGetById(videoId);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('YouTube getById failed:', err?.message || err);
		return { status: 'fail', message: 'Failed to fetch video' };
	}
};
