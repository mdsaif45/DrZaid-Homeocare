import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema/index.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'homeocare_db',
  user: process.env.DB_USER || 'homeocare_user',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
