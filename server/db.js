import mysql from 'mysql2/promise';

// MySQL connection pool. `timezone: 'Z'` makes every DATE/DATETIME/TIMESTAMP
// value travel as UTC — dates are written as UTC and read back as JS Dates
// whose toISOString() matches exactly what PostgreSQL stored.
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'dental_admin',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dental_master',
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
  supportBigNumbers: true,
});

// Force the server session timezone to UTC so SQL functions such as
// CURRENT_TIMESTAMP() (DB defaults) produce UTC values, matching the JS dates
// the driver writes with timezone: 'Z'.
pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+00:00'");
});

// Columns that must be parsed as JSON objects in API responses. On MySQL 8 the
// driver already returns them parsed; on MariaDB they come back as strings.
// The normalizer handles both cases. Keyed by "table.column".
const JSON_FIELDS = new Set(['site_content.texts', 'site_content.hero_carousel_images']);

// TINYINT(1) columns that must be exposed as real booleans in API responses
// (MySQL/MariaDB return them as 0/1 numbers).
const BOOL_FIELDS = new Set(['site_content.hero_text_enabled']);

function normalizeRows(rows, fields) {
  if (!Array.isArray(rows) || !fields) return rows;
  for (const row of rows) {
    for (const f of fields) {
      const value = row[f.name];
      if (value === undefined || value === null) continue;
      const key = `${f.table}.${f.name}`;
      if (JSON_FIELDS.has(key) && typeof value === 'string') {
        try {
          row[f.name] = JSON.parse(value);
        } catch {
          // keep the raw value if it is not valid JSON
        }
      } else if (BOOL_FIELDS.has(key)) {
        row[f.name] = value === true || value === 1 || value === '1';
      }
    }
  }
  return rows;
}

// pg-shaped wrapper so controllers keep `const { rows } = await pool.query(...)`.
async function query(sql, params) {
  const [rows, fields] = await pool.query(sql, params);
  return { rows: normalizeRows(rows, fields) };
}

async function connect() {
  const conn = await pool.getConnection();
  return {
    query: async (sql, params) => {
      const [rows, fields] = await conn.query(sql, params);
      return { rows: normalizeRows(rows, fields) };
    },
    release: () => conn.release(),
  };
}

export default { query, connect, end: () => pool.end() };
