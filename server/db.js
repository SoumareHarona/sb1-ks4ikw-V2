import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use in-memory database for development
const dbPath = process.env.NODE_ENV === 'production' 
  ? join(__dirname, '..', process.env.DB_PATH)
  : ':memory:';

// Initialize database
let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS freight_numbers (
        id TEXT PRIMARY KEY,
        number TEXT UNIQUE NOT NULL,
        mode TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY,
        freight_number_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        tracking_number TEXT UNIQUE NOT NULL,
        qr_code TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (freight_number_id) REFERENCES freight_numbers(id),
        FOREIGN KEY (sender_id) REFERENCES clients(id),
        FOREIGN KEY (recipient_id) REFERENCES clients(id)
      )
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
}

export async function asyncRun(sql, params = []) {
  const database = await getDatabase();
  try {
    const result = await database.run(sql, params);
    return {
      id: result.lastID,
      changes: result.changes
    };
  } catch (error) {
    console.error('Error executing query:', sql, params, error);
    throw error;
  }
}

export async function asyncGet(sql, params = []) {
  const database = await getDatabase();
  try {
    return await database.get(sql, params);
  } catch (error) {
    console.error('Error executing query:', sql, params, error);
    throw error;
  }
}

export async function asyncAll(sql, params = []) {
  const database = await getDatabase();
  try {
    return await database.all(sql, params);
  } catch (error) {
    console.error('Error executing query:', sql, params, error);
    throw error;
  }
}

// Handle cleanup on process termination
process.on('SIGINT', async () => {
  if (db) {
    try {
      await db.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
      process.exit(1);
    }
  }
  process.exit(0);
});