import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
  console.log('Connected to the in-memory SQLite database');
});

// Initialize database schema
db.serialize(() => {
  // Freight Numbers table
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
  `);

  // Clients table
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      freight_number_id TEXT NOT NULL,
      tracking_number TEXT UNIQUE NOT NULL,
      qr_code TEXT,
      sender_name TEXT NOT NULL,
      sender_phone TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      recipient_phone TEXT NOT NULL,
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
      FOREIGN KEY (freight_number_id) REFERENCES freight_numbers(id)
    )
  `);
});

// Helper functions for database operations
export function asyncRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function asyncGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function asyncAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export { db };