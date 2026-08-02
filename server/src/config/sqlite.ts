import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

const DB_PATH = path.join(process.cwd(), 'homeocare.sqlite');
const SCHEMA_PATH = path.join(process.cwd(), 'src', 'db', 'sqliteSchema.sql');

let dbInstance: Database | null = null;
let dbInitPromise: Promise<Database> | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      try {
        const filebuffer = fs.readFileSync(DB_PATH);
        dbInstance = new SQL.Database(filebuffer);
        logger.info(`⚡ SQLite (sql.js) loaded existing database file at: ${DB_PATH}`);
      } catch (err) {
        logger.error('⚠️ Corrupted SQLite database file detected, reinitializing fresh DB:', err);
        dbInstance = new SQL.Database();
        initSqliteSchema(dbInstance);
      }
    } else {
      dbInstance = new SQL.Database();
      logger.info(`⚡ SQLite (sql.js) initialized new database at: ${DB_PATH}`);
      initSqliteSchema(dbInstance);
    }

    ensureMigrations(dbInstance);
    saveDb(dbInstance);

    return dbInstance;
  })();

  return dbInitPromise;
}

function initSqliteSchema(db: Database) {
  if (fs.existsSync(SCHEMA_PATH)) {
    const sql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.run(sql);
    logger.info('✅ SQLite schema initialized successfully from sqliteSchema.sql.');
  }
}

function ensureMigrations(db: Database) {
  try {
    initSqliteSchema(db);
  } catch (err) {
    logger.error('SQLite Schema sync error:', err);
  }
}

export function saveDb(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    logger.error('❌ Failed to save SQLite db:', err);
  }
}

// Promisified Helper Methods for SQLite Queries
export const dbQuery = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  const dbInstance = await getDb();
  const stmt = dbInstance.prepare(sql);
  if (params && params.length > 0) {
    stmt.bind(params);
  }
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
};

export const dbGet = async <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  const rows = await dbQuery<T>(sql, params);
  return rows[0];
};

export const dbRun = async (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  const dbInstance = await getDb();
  dbInstance.run(sql, params);
  saveDb(dbInstance);
  return { lastID: 0, changes: 1 };
};
