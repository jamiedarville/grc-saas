import knex, { Knex } from 'knex';
import { logger } from '../utils/logger';

// Database configuration
const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'grc_user',
    password: process.env.DB_PASSWORD || 'grc_password',
    database: process.env.DB_NAME || 'grc_saas',
    charset: 'utf8mb4',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

// Create database instance
export const db = knex(config);

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection
    await db.raw('SELECT 1');
    logger.info('Database connection established successfully');

    // Run migrations
    await db.migrate.latest();
    logger.info('Database migrations completed');

    // Run seeds in development
    if (process.env.NODE_ENV === 'development') {
      await db.seed.run();
      logger.info('Database seeds completed');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export default db;