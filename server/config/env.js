// Centralized environment configuration.
// Fallbacks keep the API runnable out-of-the-box in development.

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const PORT = parseInt(process.env.PORT || '4000', 10);

// JWT secret: required and strong in production. A dev-only fallback exists so
// the API boots locally without configuration, but it must never be used in
// production — the process refuses to start if it is missing or too short.
const rawSecret = process.env.JWT_SECRET;
export const JWT_SECRET = rawSecret || 'dental-master-dev-secret-change-me';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (IS_PRODUCTION && (!rawSecret || rawSecret.length < 32)) {
  throw new Error(
    'JWT_SECRET must be set to a random string of at least 32 characters in production.'
  );
}

export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// Auth cookie: httpOnly, never readable from JS. `secure` only applies over
// HTTPS (production); `COOKIE_SAMESITE=lax` blocks cross-site CSRF reads.
export const COOKIE_NAME = process.env.COOKIE_NAME || 'dma_token';
export const COOKIE_SECURE = IS_PRODUCTION || process.env.COOKIE_SECURE === 'true';
export const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || 'lax';

// CORS allow-list (comma-separated origins). Empty = same-origin only, which is
// the default deployment (Express serves the frontend build on the same origin).
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '';

// Trust the first proxy hop (e.g. Nginx) so rate limiting sees the real client IP.
export const TRUST_PROXY = process.env.TRUST_PROXY === 'true';
