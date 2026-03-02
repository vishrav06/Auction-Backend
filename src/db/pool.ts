import { Pool } from 'pg';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => console.log('✅ Connected to Supabase PostgreSQL'));
pool.on('error', (err) => console.error('❌ Pool error:', err));

export { pool };