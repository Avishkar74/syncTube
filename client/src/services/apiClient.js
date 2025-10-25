// Prefer same-origin so the Vite dev proxy forwards /api to the backend.
// If you deploy the API separately, set VITE_API_BASE_URL explicitly.
// Trim any trailing slashes to avoid double-slash URLs like https://host//api/...
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export async function apiGet(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...options, method: 'GET' });
  if (!res.ok) {
  let msg = `GET ${path} failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.message) msg += ` - ${body.message}`;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPost(path, body, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options
  });
  if (!res.ok) {
    let msg = `POST ${path} failed: ${res.status}`;
    try {
      const text = await res.text();
      msg += text ? ` - ${text}` : '';
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}
