import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

const rootDir = fs.existsSync(path.join(process.cwd(), 'server'))
  ? path.join(process.cwd(), 'server')
  : process.cwd();

const DB_PATH = path.join(rootDir, 'homeocare.sqlite');
const SCHEMA_PATH = path.join(rootDir, 'src', 'db', 'sqliteSchema.sql');

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
    seedDefaultUser(dbInstance);
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
  } else {
    logger.warn(`⚠️ SQLite schema file not found at: ${SCHEMA_PATH}`);
  }
}

function ensureMigrations(db: Database) {
  try {
    initSqliteSchema(db);
  } catch (err) {
    logger.error('SQLite Schema sync error:', err);
  }
}

function seedDefaultUser(db: Database) {
  try {
    const res = db.exec("SELECT * FROM users WHERE email = 'dr.zaid@homeocare.com'");
    if (!res || res.length === 0 || !res[0].values || res[0].values.length === 0) {
      db.run(
        `INSERT INTO users (email, password_hash, full_name, role, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'dr.zaid@homeocare.com',
          '$2b$10$XeGscYOxRQpl2TNBKW3c9eSqG/ua7hu4wfv0Ek/4XRnbyI9yM2nMi',
          'Dr. MD Zaid',
          'doctor',
          '+91 98765 43210',
        ]
      );
      logger.info('✅ Verified & seeded default doctor user: dr.zaid@homeocare.com / admin123');
    }
  } catch (err) {
    logger.error('SQLite seeding error:', err);
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
