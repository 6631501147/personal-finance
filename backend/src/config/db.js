import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbPromise = null;

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }
  return dbPromise;
};

// Initialize schema automatically so it works out of the box!
export const initDb = async () => {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  
  // Insert a mock user if one doesn't exist so we satisfy foreign keys
  await db.run(`
    INSERT OR IGNORE INTO users (id, full_name, email, password_hash) 
    VALUES (1, 'John Doe', 'john@example.com', 'hashedpassword')
  `);
};
