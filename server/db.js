import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable verbose logging for SQLite
sqlite3.verbose();

let db = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    console.log('Initializing new database connection...');
    
    // Use file-based database instead of in-memory, relative to server directory
    const dbPath = path.join(__dirname, '..', 'data', 'dev.db');
    console.log('Database path:', dbPath);
    
    // Ensure the data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory:', dataDir);
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log('Creating new database connection');
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
      if (err) {
        console.error('Database initialization error:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to the SQLite database');
      
      try {
        await initializeSchema();
        if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
          await addTestData();
        }
        resolve(db);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        reject(error);
      }
    });
  });
}

async function initializeSchema() {
  console.log('Initializing database schema...');
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('Creating clients table...');
      // Create clients table first with proper UNIQUE constraint
      db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          location TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT phone_unique UNIQUE (phone)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating clients table:', err);
          reject(err);
          return;
        }
        console.log('clients table created successfully');
      });

      console.log('Creating freight_numbers table...');
      // Then create freight numbers table
      db.run(`
        CREATE TABLE IF NOT EXISTS freight_numbers (
          id TEXT PRIMARY KEY,
          number TEXT UNIQUE NOT NULL,
          mode TEXT NOT NULL,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating freight_numbers table:', err);
          reject(err);
          return;
        }
        console.log('freight_numbers table created successfully');
      });

      console.log('Creating shipments table...');
      // Finally create shipments table that depends on both clients and freight_numbers
      db.run(`
        CREATE TABLE IF NOT EXISTS shipments (
          id TEXT PRIMARY KEY,
          freight_number_id TEXT NOT NULL,
          tracking_number TEXT UNIQUE NOT NULL,
          qr_code TEXT,
          sender_id TEXT NOT NULL,
          recipient_id TEXT NOT NULL,
          recipient_email TEXT,
          recipient_street TEXT,
          recipient_city TEXT,
          recipient_landmark TEXT,
          recipient_notes TEXT,
          food_weight REAL,
          non_food_weight REAL,
          hn7_weight REAL,
          total_weight REAL,
          length REAL,
          width REAL,
          height REAL,
          volume REAL,
          package_type TEXT,
          packaging TEXT,
          special_handling TEXT,
          comments TEXT,
          additional_fees_amount REAL,
          additional_fees_currency TEXT CHECK(additional_fees_currency IN ('EUR', 'XOF')),
          advance_amount REAL,
          advance_currency TEXT CHECK(advance_currency IN ('EUR', 'XOF')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (freight_number_id) REFERENCES freight_numbers(id),
          FOREIGN KEY (sender_id) REFERENCES clients(id),
          FOREIGN KEY (recipient_id) REFERENCES clients(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating shipments table:', err);
          reject(err);
          return;
        }
        console.log('shipments table created successfully');
        resolve();
      });
    });
  });
}

async function addTestData() {
  console.log('Adding test data...');
  
  try {
    // Add test client
    await asyncRun(`
      INSERT INTO clients (id, name, phone, location)
      VALUES (?, ?, ?, ?)
    `, ['client-1', 'Test Client', '1234567890', 'Paris']);
    
    console.log('Test client added');

    // Add test freight number
    await asyncRun(`
      INSERT INTO freight_numbers (id, number, mode, origin, destination)
      VALUES (?, ?, ?, ?, ?)
    `, ['test-1', 'FR001', 'air', 'FR', 'ML']);
    
    console.log('Test freight number added');

    // Add test shipment
    await asyncRun(`
      INSERT INTO shipments (
        id, freight_number_id, tracking_number,
        sender_id, recipient_id,
        packaging
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'shipment-1',
      'test-1',
      'TRK001',
      'client-1',
      'client-1',
      'Box'
    ]);
    
    console.log('Test shipment added');
    console.log('Test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
}

// Helper functions for database operations
export async function asyncRun(sql, params = []) {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    console.log('Executing SQL:', sql, 'with params:', params);
    database.run(sql, params, function(err) {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        console.log('SQL executed successfully');
        resolve(this);
      }
    });
  });
}

export async function asyncGet(sql, params = []) {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    console.log('Executing SQL:', sql, 'with params:', params);
    database.get(sql, params, (err, row) => {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        console.log('SQL executed successfully, result:', row);
        resolve(row);
      }
    });
  });
}

export async function asyncAll(sql, params = []) {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    console.log('Executing SQL:', sql, 'with params:', params);
    database.all(sql, params, (err, rows) => {
      if (err) {
        console.error('SQL Error:', err);
        reject(err);
      } else {
        console.log('SQL executed successfully, result count:', rows?.length);
        resolve(rows);
      }
    });
  });
}
