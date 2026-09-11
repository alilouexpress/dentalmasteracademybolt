import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { uploadsDir } from './config/paths.js';
import { CORS_ORIGIN, TRUST_PROXY } from './config/env.js';
import securityHeaders from './middleware/security.js';
import { ensureCsrfCookie, csrfProtect } from './lib/csrf.js';
import { notFound, errorHandler } from './middleware/errors.js';
import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import purchasesRoutes from './routes/purchases.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Hostinger, dist/ may be in different locations depending on the build layout.
// Check multiple paths: relative to server/, in CWD, and in Hostinger's nodejs/ folder.
const possibleDistDirs = [
  path.join(__dirname, '..', 'dist'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'nodejs'),
];
const distDir = possibleDistDirs.find((p) => fs.existsSync(p)) || possibleDistDirs[0];

const app = express();

// Behind a reverse proxy (Nginx), trust the first hop so rate limiting and
// req.ip see the real client address.
if (TRUST_PROXY) app.set('trust proxy', 1);

// CORS: restricted to an explicit allow-list when configured. Empty by default
// (same-origin only — Express serves the frontend build in production).
const corsOrigins = CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
if (corsOrigins.length > 0) {
  app.use(cors({ origin: corsOrigins, credentials: true }));
}

app.use(express.json({ limit: '20mb' }));
app.use(securityHeaders);
app.use(ensureCsrfCookie);

app.use('/uploads', express.static(uploadsDir, { maxAge: 0, etag: false }));

// Never cache API responses so edits appear on the site immediately.
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Double-submit CSRF check for every state-changing API request.
app.use('/api', csrfProtect);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api', purchasesRoutes);
app.use('/api', uploadRoutes);

// Serve the built frontend (dist/) from the same Express process. Required on
// shared hosting where no Nginx config is available. API and uploads keep
// priority; any other GET is served the SPA index.html (hash routing).
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
