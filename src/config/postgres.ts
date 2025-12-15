import { Pool } from 'pg';

export const pgPool = new Pool({
  host: '127.0.0.1',
  port: 5433, // 🔥 IMPORTANT
  user: 'postgres',
  password: 'postgres',
  database: 'orders_db',
  ssl: false
});

pgPool.on('connect', () => {
  console.log('✅ Connected to Docker PostgreSQL (orders_db)');
});
