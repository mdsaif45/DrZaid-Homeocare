import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
import { envConfig } from './env.js';
import { dbQuery, dbRun } from './sqlite.js';

dotenv.config();

let pool: pg.Pool | null = null;

if (envConfig.dbProvider === 'postgres' || envConfig.dbProvider === 'drizzle') {
  pool = new pg.Pool({
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
  });
}

export { pool };

export const db = {
  query: async (text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> => {
    if (envConfig.dbProvider === 'sqlite') {
      const sqliteText = text.replace(/\$\d+/g, '?').replace(/RETURNING \*/gi, '').trim();
      const upper = sqliteText.toUpperCase();
      if (upper.startsWith('SELECT')) {
        const rows = await dbQuery(sqliteText, params);
        return { rows, rowCount: rows.length };
      } else {
        const res = await dbRun(sqliteText, params);
        return { rows: [], rowCount: res.changes };
      }
    }

    if (!pool) {
      throw new Error('PostgreSQL pool is not initialized');
    }

    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return { rows: res.rows, rowCount: res.rowCount || 0 };
    } catch (error) {
      logger.error('Database query error', { text, error });
      throw error;
    }
  },
};

export const query = db.query;
