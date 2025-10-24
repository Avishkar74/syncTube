// Prefer same-origin so the Vite dev proxy forwards /api to the backend.
// If you deploy the API separately, set VITE_API_BASE_URL explicitly.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { ...options, method: 'GET' });
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
  const res = await fetch(`${BASE_URL}${path}`, {
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
