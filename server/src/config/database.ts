import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const { Pool } = pg;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'homeocare_db',
  user: process.env.DB_USER || 'homeocare_user',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
export const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

// Export a query function for easier use
export const db = {
  query: async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Database query error', { text, error });
      throw error;
    }
  },

  // For transactions
  getClient: async () => {
    const client = await pool.connect();
    const originalQuery = client.query.bind(client);
    const originalRelease = client.release.bind(client);

    // Set a timeout to prevent clients from being checked out for too long
    const timeout = setTimeout(() => {
      logger.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    // Monkey patch the client to track queries
    client.query = (...args: any[]) => {
      client.lastQuery = args;
      return originalQuery(...args);
    };

    client.release = () => {
      clearTimeout(timeout);
      client.query = originalQuery;
      client.release = originalRelease;
      return originalRelease();
    };

    return client;
  },
};

// Test the database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('✅ Database connection successful', {
      serverTime: result.rows[0].now,
    });
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed', error);
    return false;
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool', error);
    throw error;
  }
};
