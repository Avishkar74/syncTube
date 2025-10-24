const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { ...options, method: 'GET' });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}
