import multer from 'multer';
import path from 'node:path';
import { uploadsDir } from '../config/paths.js';

// Restrict uploads to the media types the application actually uses.
// Blocks documents/scripts (e.g. .html, .js) that could execute in the
// site origin if served from /uploads.
// SVG is intentionally excluded: an SVG served from the same origin can
// execute embedded scripts when opened as a top-level document (stored XSS).
const ALLOWED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp',
  '.mp4', '.webm', '.mov',
  '.mp3', '.wav', '.ogg',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      const err = new Error('Type de fichier non autorisé.');
      err.code = 'UNSUPPORTED_FILE_TYPE';
      return cb(err);
    }
    cb(null, true);
  },
});
