import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../apps/api/src/modules/private-content/private-content.repository.ts', import.meta.url));
const { Pool } = require('pg');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/apply_sql_file.mjs <sql-file>');
  process.exit(2);
}

const sql = await readFile(filePath, 'utf8');
const pool = new Pool({
  connectionString: process.env.RAFIQ_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:55422/postgres',
});

const client = await pool.connect();
try {
  await client.query('begin');
  await client.query(sql);
  await client.query('commit');
  console.log(`applied ${filePath}`);
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  client.release();
  await pool.end();
}
