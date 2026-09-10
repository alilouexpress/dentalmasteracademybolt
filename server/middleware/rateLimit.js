// Lightweight in-memory sliding-window rate limiter, keyed by client IP.
// Sufficient for a single-admin application; no external dependency.
// Note: in-memory state is per-process — if the app is ever scaled to
// multiple processes, swap this for a shared store (Redis, etc.).

function createRateLimiter({ windowMs, max, message }) {
  const buckets = new Map();

  // Prune stale buckets so the map cannot grow unbounded.
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, times] of buckets) {
      const active = times.filter((t) => now - t < windowMs);
      if (active.length === 0) buckets.delete(key);
      else buckets.set(key, active);
    }
  }, Math.max(windowMs, 60_000));
  timer.unref();

  return function rateLimit(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const times = (buckets.get(ip) || []).filter((t) => now - t < windowMs);

    if (times.length >= max) {
      const retryAfter = Math.max(1, Math.ceil((windowMs - (now - times[0])) / 1000));
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: message });
    }

    times.push(now);
    buckets.set(ip, times);
    next();
  };
}

// Login / password change: max 10 attempts per 15 minutes per IP.
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Trop de tentatives. Réessayez dans quelques minutes.',
});

// Account creation: max 5 attempts per hour per IP.
export const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de création de compte. Réessayez plus tard.',
});

// Public purchase form (no auth): max 10 submissions per 15 minutes per IP,
// to prevent database spam.
export const purchasesLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Trop de demandes envoyées. Réessayez dans quelques minutes.',
});
