import { COOKIE_NAME, COOKIE_SECURE, COOKIE_SAMESITE } from '../config/env.js';

// Kept in sync with the JWT expiry (7d by default).
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Minimal, safe cookie reader (no extra dependency needed).
export function readCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(eq + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

export function readAuthCookie(req) {
  return readCookie(req, COOKIE_NAME);
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    path: '/',
  });
}
