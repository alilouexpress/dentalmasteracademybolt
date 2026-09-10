import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
// Only `*.mysql.sql` files are applied to MySQL. The original PostgreSQL
// migration files (`0001_initial_schema.sql`) are kept for reference and are
// skipped here.
const SUFFIX = '.mysql.sql';

// Tracks every applied migration. MySQL does not support transactional DDL, so
// each migration file is applied and recorded separately; `CREATE TABLE IF NOT
// EXISTS` / `INSERT IGNORE` keep every migration safe to re-run.
async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version varchar(255) PRIMARY KEY,
      name varchar(255) NOT NULL,
      applied_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

// Splits a .sql migration file into individual statements, respecting single
// quoted string literals and stripping SQL comments. Keeps
// CLIENT_MULTI_STATEMENTS disabled on the connection pool.
function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inString = false;
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (inString) {
      current += ch;
      if (ch === "'") {
        if (next === "'") {
          current += next;
          i++;
        } else if (sql[i - 1] !== '\\') {
          inString = false;
        }
      }
    } else if (ch === "'") {
      inString = true;
      current += ch;
    } else if (ch === '-' && next === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
    } else if (ch === '/' && next === '*') {
      i += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
      i++;
    } else if (ch === ';') {
      if (current.trim().length > 0) statements.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
    i++;
  }
  if (current.trim().length > 0) statements.push(current.trim());
  return statements;
}

async function migrate() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(SUFFIX))
    .sort();

  if (files.length === 0) {
    console.log(`No migration files found in server/migrations (${SUFFIX}).`);
    return;
  }

  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const { rows } = await client.query('SELECT version FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.version));
    const pending = files.filter((f) => !applied.has(f));

    if (pending.length === 0) {
      console.log(`No pending migrations (${files.length}/${files.length} applied).`);
      return;
    }

    console.log(`Found ${files.length} migration file(s), ${pending.length} pending:`);
    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      const statements = splitStatements(sql);
      try {
        for (const statement of statements) {
          await client.query(statement);
        }
        await client.query('INSERT INTO schema_migrations (version, name) VALUES (?, ?)', [file, file]);
        console.log(`  ✓ ${file}`);
      } catch (err) {
        console.error(`  ✗ ${file} FAILED: ${err.message}`);
        console.error(`    MySQL DDL is not transactional; check the tables and re-run.`);
        process.exitCode = 1;
        return;
      }
    }
    console.log('Migration complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
