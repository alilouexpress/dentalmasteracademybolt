import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// In-memory revocation list: jti -> expiry timestamp (ms).
// Lets logout actually invalidate a token within this process. Not persisted
// across restarts — tokens are still short-lived (7d by default) and the
// httpOnly cookie greatly limits the chance of theft in the first place.
const revoked = new Map();

setInterval(
  () => {
    const now = Date.now();
    for (const [jti, exp] of revoked) {
      if (exp <= now) revoked.delete(jti);
    }
  },
  60 * 60 * 1000
).unref();

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, jti: crypto.randomUUID() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.jti && revoked.has(payload.jti)) {
    const err = new Error('Token révoqué.');
    err.code = 'TOKEN_REVOKED';
    throw err;
  }
  return payload;
}

export function revokeToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    if (payload.jti && payload.exp) {
      revoked.set(payload.jti, payload.exp * 1000);
    }
  } catch {
    // ignore malformed or already-invalid tokens
  }
}
