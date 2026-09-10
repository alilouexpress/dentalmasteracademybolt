import crypto from 'node:crypto';
import { readCookie } from './cookies.js';
import { COOKIE_SECURE, COOKIE_SAMESITE } from '../config/env.js';

// Double-submit CSRF protection. The token is a readable cookie; the SPA echoes
// it back in the X-CSRF-Token header for every state-changing request. Because
// the cookie is SameSite, a cross-site attacker cannot read it (and thus cannot
// set a matching header). Bearer-authenticated API clients skip the check
// (they have no cookie-based CSRF surface).

export const CSRF_COOKIE_NAME = 'dma_csrf';

export function ensureCsrfCookie(req, res, next) {
  const existing = readCookie(req, CSRF_COOKIE_NAME);
  if (!existing || existing.length < 16) {
    res.cookie(CSRF_COOKIE_NAME, crypto.randomBytes(32).toString('hex'), {
      httpOnly: false,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SAMESITE,
      path: '/',
    });
  }
  next();
}

export function csrfProtect(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) {
    return next();
  }
  const cookie = readCookie(req, CSRF_COOKIE_NAME);
  const header = req.headers['x-csrf-token'];
  if (!cookie || !header || cookie !== header) {
    return res.status(403).json({ error: 'Jeton CSRF invalide.' });
  }
  next();
}
