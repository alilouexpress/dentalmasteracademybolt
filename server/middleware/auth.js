import { verifyToken } from '../lib/tokens.js';
import { readAuthCookie } from '../lib/cookies.js';

// Accepts the token from the httpOnly auth cookie (browser) or from an
// Authorization: Bearer header (API clients, curl, etc.). Also rejects tokens
// that were explicitly revoked (e.g. on logout).
export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  let token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) token = readAuthCookie(req);
  if (!token) return res.status(401).json({ error: 'Non autorisé.' });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expirée. Reconnectez-vous.' });
  }
}
