import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  dbProvider: 'sqlite' | 'postgres' | 'drizzle';
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
}

export const envConfig: EnvConfig = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbProvider: (process.env.DB_PROVIDER as any) || 'sqlite',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME || 'homeocare_db',
  dbUser: process.env.DB_USER || 'homeocare_user',
  dbPassword: process.env.DB_PASSWORD || 'password',
};
