import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const BACKUP_PATTERN = /^pg-backup-.*\.json$/;

const SITE_CONTENT_COLUMNS = [
  'id', 'hero_title', 'hero_subtitle', 'hero_image_url', 'product_image_url',
  'app_image_1_url', 'app_image_2_url', 'academy_image_url', 'price_ssd',
  'price_install', 'whatsapp_number', 'final_cta_title', 'logo_image_url',
  'hero_mode', 'hero_carousel_images', 'hero_video_url', 'hero_overlay_opacity',
  'hero_zoom', 'hero_text_enabled', 'hero_text_color', 'hero_text_size',
  'academy_image_1', 'academy_image_2', 'academy_image_3', 'academy_image_4',
  'academy_image_5', 'academy_image_6', 'academy_image_7', 'academy_image_8',
  'academy_image_9', 'academy_image_10', 'texts', 'updated_at',
];

const JSON_COLUMNS = new Set(['texts', 'hero_carousel_images']);
const BOOL_COLUMNS = new Set(['hero_text_enabled']);
const DATE_COLUMNS = new Set(['created_at', 'updated_at', 'applied_at']);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'dental_admin',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dental_master',
  charset: 'utf8mb4',
  timezone: 'Z',
});

function latestBackup() {
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => BACKUP_PATTERN.test(f)).sort();
  if (files.length === 0) throw new Error('No PG backup found in backups/. Run: node scripts/backup-pg.mjs');
  return path.join(BACKUP_DIR, files[files.length - 1]);
}

function buildSiteContentParams(row) {
  const params = [];
  for (const col of SITE_CONTENT_COLUMNS) {
    if (!(col in row)) continue;
    let v = row[col];
    if (JSON_COLUMNS.has(col)) v = JSON.stringify(v);
    else if (BOOL_COLUMNS.has(col)) v = v ? 1 : 0;
    else if (DATE_COLUMNS.has(col)) v = new Date(v);
    params.push(v);
  }
  return params;
}

function buildSiteContentSet() {
  const cols = SITE_CONTENT_COLUMNS.filter((c) => c !== 'id');
  return cols.map((c) => `\`${c}\` = VALUES(\`${c}\`)`).join(', ');
}

function buildSiteContentUpsert(cols) {
  const names = cols.map((c) => `\`${c}\``);
  const q = names.map(() => '?');
  return `INSERT INTO site_content (${names.join(', ')}) VALUES (${q.join(', ')}) ON DUPLICATE KEY UPDATE ${buildSiteContentSet()}`;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return a === b;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

async function migrateData(backup) {
  const t = backup.tables;
  let ok = true;

  // ---- users ----
  for (const row of t.users) {
    await pool.query(
      'INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE email = VALUES(email), password_hash = VALUES(password_hash), created_at = VALUES(created_at)',
      [row.id, row.email, row.password_hash, new Date(row.created_at)]
    );
  }
  console.log(`users: ${t.users.length} row(s) upserted`);

  // ---- site_content ----
  for (const row of t.site_content) {
    const cols = Object.keys(row).filter((c) => SITE_CONTENT_COLUMNS.includes(c));
    await pool.query(buildSiteContentUpsert(cols), buildSiteContentParams(row));
  }
  console.log(`site_content: ${t.site_content.length} row(s) upserted`);

  // ---- purchase_requests ----
  for (const row of t.purchase_requests) {
    const cols = ['id', 'full_name', 'email', 'phone', 'country', 'specialty', 'plan', 'message', 'status', 'created_at'];
    const names = cols.map((c) => `\`${c}\``);
    const params = cols.map((c) => {
      let v = row[c];
      if (DATE_COLUMNS.has(c)) v = new Date(v);
      return v;
    });
    await pool.query(
      `INSERT INTO purchase_requests (${names.join(', ')}) VALUES (${cols.map(() => '?').join(', ')}) ` +
        'ON DUPLICATE KEY UPDATE status = VALUES(status), message = VALUES(message)',
      params
    );
  }
  console.log(`purchase_requests: ${t.purchase_requests.length} row(s) upserted`);

  // ---- schema_migrations (PG history row, preserved as-is) ----
  for (const row of t.schema_migrations) {
    await pool.query(
      'INSERT IGNORE INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
      [row.version, row.name, new Date(row.applied_at)]
    );
  }
  console.log(`schema_migrations: ${t.schema_migrations.length} PG history row(s) inserted`);

  return ok;
}

async function verify(backup) {
  const t = backup.tables;
  let pass = 0;
  let fail = 0;
  const report = (label, condition) => {
    if (condition) { pass++; console.log(`  ✓ ${label}`); }
    else { fail++; console.log(`  ✗ ${label}`); }
  };

  console.log('\n=== VERIFICATION PG backup vs MySQL ===');

  const [users] = await pool.query('SELECT id, email, password_hash, created_at FROM users');
  report(`users count (${t.users.length})`, users.length === t.users.length);
  if (users.length === t.users.length && users.length > 0) {
    const u = users[0];
    const b = t.users[0];
    report('users id', u.id === b.id);
    report('users email', u.email === b.email);
    report('users password_hash', u.password_hash === b.password_hash);
    report('users created_at UTC', u.created_at instanceof Date && u.created_at.toISOString() === b.created_at);
  }

  const [contents] = await pool.query('SELECT * FROM site_content WHERE id = 1');
  if (contents.length === 1) {
    const c = contents[0];
    const b = t.site_content[0];
    for (const col of SITE_CONTENT_COLUMNS) {
      if (!(col in b)) continue;
      let mVal = c[col];
      let pgVal = b[col];
      if (JSON_COLUMNS.has(col)) {
        if (typeof mVal === 'string') { try { mVal = JSON.parse(mVal); } catch { /* keep */ } }
        report(`site_content.${col} (JSON)`, deepEqual(mVal, pgVal));
      } else if (BOOL_COLUMNS.has(col)) {
        report(`site_content.${col} (bool)`, mVal === 1 === (pgVal === true));
      } else if (DATE_COLUMNS.has(col)) {
        report(`site_content.${col} (UTC)`, mVal instanceof Date && mVal.toISOString() === pgVal);
      } else {
        report(`site_content.${col}`, mVal === pgVal || String(mVal) === String(pgVal));
      }
    }
  } else {
    report('site_content row present', false);
  }

  const [purchases] = await pool.query('SELECT COUNT(*) AS c FROM purchase_requests');
  report(`purchase_requests count (${t.purchase_requests.length})`, Number(purchases[0].c) === t.purchase_requests.length);

  const [migrations] = await pool.query('SELECT version FROM schema_migrations');
  const versions = migrations.map((r) => r.version);
  const expectedPgHistory = t.schema_migrations.map((r) => r.version);
  report('schema_migrations PG history preserved', expectedPgHistory.every((v) => versions.includes(v)));
  report('schema_migrations MySQL migration recorded', versions.includes('0001_initial_schema.mysql.sql'));

  console.log(`\nResult: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exitCode = 1;
}

const file = latestBackup();
console.log(`Using backup: ${file}`);
const backup = JSON.parse(fs.readFileSync(file, 'utf8'));

migrateData(backup)
  .then(() => verify(backup))
  .finally(async () => {
    await pool.end();
  })
  .catch((err) => {
    console.error('MIGRATION FAILED:', err);
    process.exit(1);
  });
