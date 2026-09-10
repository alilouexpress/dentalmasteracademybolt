const BASE = (import.meta.env.VITE_API_URL as string) || '';

// The JWT lives in an httpOnly cookie (set by the server) and is never exposed
// to JavaScript. Only the non-sensitive user profile is kept in localStorage.
// CSRF: the server sets a readable double-submit cookie (dma_csrf) which we
// echo back in the X-CSRF-Token header for every state-changing request.

const CSRF_COOKIE = 'dma_csrf';

export function getStoredUser(): { id: string; email: string } | null {
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: { id: string; email: string } | null) {
  if (user) localStorage.setItem('admin_user', JSON.stringify(user));
  else localStorage.removeItem('admin_user');
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function getCsrfToken(): Promise<string> {
  const existing = getCookieValue(CSRF_COOKIE);
  if (existing) return existing;
  // Cookie not set yet (e.g. first-ever visit): force the server to set one.
  try {
    await fetch(`${BASE}/api/health`, { credentials: 'include', cache: 'no-store' });
  } catch {
    // ignore, cookie may still be absent
  }
  return getCookieValue(CSRF_COOKIE) || '';
}

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
  error: string | null;
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<ApiResult<T>> {
  const method = options.method || (options.body !== undefined ? 'POST' : 'GET');
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    headers['X-CSRF-Token'] = await getCsrfToken();
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
      cache: 'no-store',
    });
  } catch (err) {
    return { ok: false, status: 0, data: null as T, error: (err as Error).message };
  }

  let data: T = null as T;
  try {
    data = (await res.json()) as T;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const message = (data as { error?: string })?.error || `Erreur ${res.status}`;
    return { ok: false, status: res.status, data: null as T, error: message };
  }

  return { ok: true, status: res.status, data, error: null };
}

export async function uploadFile(file: File): Promise<ApiResult<{ url: string }>> {
  const headers: Record<string, string> = {};
  headers['X-CSRF-Token'] = await getCsrfToken();

  const form = new FormData();
  form.append('file', file);

  try {
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers,
      body: form,
      credentials: 'include',
      cache: 'no-store',
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok) return { ok: false, status: res.status, data: null as never, error: data.error || `Erreur ${res.status}` };
    if (!data.url) return { ok: false, status: res.status, data: null as never, error: 'Échec du téléversement.' };
    return { ok: true, status: res.status, data: { url: data.url }, error: null };
  } catch (err) {
    return { ok: false, status: 0, data: null as never, error: (err as Error).message };
  }
}
