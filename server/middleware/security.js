// Minimal, safe security headers. CSP is intentionally NOT set here
// because the React frontend relies on inline styles.
import { IS_PRODUCTION } from '../config/env.js';

export default function securityHeaders(_req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (IS_PRODUCTION) {
    res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
}
