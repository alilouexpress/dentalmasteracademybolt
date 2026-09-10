import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

const pool = new pg.Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'dental_admin',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'dental_master',
});

const TABLES = ['users', 'site_content', 'purchase_requests', 'schema_migrations'];

async function dump() {
  const backup = { exportedAt: new Date().toISOString(), engine: 'postgresql', tables: {} };
  for (const table of TABLES) {
    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    backup.tables[table] = rows.map((r) => {
      const clean = {};
      for (const [k, v] of Object.entries(r)) {
        if (v instanceof Date) clean[k] = v.toISOString();
        else if (v === null) clean[k] = null;
        else if (typeof v === 'object') clean[k] = JSON.parse(JSON.stringify(v));
        else clean[k] = v;
      }
      return clean;
    });
  }
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(BACKUP_DIR, `pg-backup-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 2), 'utf8');
  console.log(`Backup written: ${file}`);
  for (const [t, rows] of Object.entries(backup.tables)) {
    console.log(`  ${t}: ${rows.length} row(s)`);
  }
  return file;
}

dump()
  .then(() => pool.end())
  .catch((err) => {
    console.error('BACKUP FAILED:', err);
    process.exit(1);
  });
