const fs = require('fs');
const Database = require('better-sqlite3');
const dbPath = './data/db.sqlite';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');

const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT,
  is_admin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  price INTEGER,
  cycle TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  plan_id INTEGER,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  amount INTEGER,
  file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(adminPass, salt);

const insert = db.prepare('INSERT OR IGNORE INTO users (email, password, name, is_admin) VALUES (?,?,?,?)');
insert.run(adminEmail, hash, 'Admin', 1);

const p = db.prepare('INSERT OR IGNORE INTO plans (id,name,description,price,cycle) VALUES (?,?,?,?,?)');
p.run(1,'Basic','Basic shared hosting',499,'monthly');
p.run(2,'Pro','Pro shared hosting',899,'monthly');
p.run(3,'Annual','Best value yearly',4999,'yearly');

console.log('Database initialized. Admin:', adminEmail);
process.exit(0);
