import { Pool } from 'pg';

export const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres', // change if your password is different
  database: 'orders_db'
});
