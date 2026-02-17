-- AgroVibes database schema (SQLite)
-- Run: sqlite3 agro.db < schema.sql

-- Media feed posts (farmer stories, photos, videos)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmer TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Video', 'Photo')),
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge base guides
CREATE TABLE IF NOT EXISTS guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Equipment (rent/sell listings)
CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Rent', 'Sell')),
  price TEXT NOT NULL,
  location TEXT,
  includes_operator INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Labor workers (profiles)
CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL,
  availability TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job listings (posted by farmers)
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fertilizers & seeds (products catalog)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  type_key TEXT NOT NULL,
  crops TEXT NOT NULL,
  benefits TEXT NOT NULL,
  risk TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Direct sales (farm produce marketplace)
CREATE TABLE IF NOT EXISTS sales_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  farm TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Learning courses
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  modules INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  badge TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_equipment_mode ON equipment(mode);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_sales_location ON sales_items(location);
