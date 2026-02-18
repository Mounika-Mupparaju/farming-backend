-- PostgreSQL schema for AgroVibes (shared / deployed backend)
-- Run this in your Neon/Render Postgres or psql after creating DB

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  farmer TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Photo',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]',
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  mode TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  includes_operator BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  experience TEXT NOT NULL,
  availability TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  type_key TEXT NOT NULL,
  crops TEXT NOT NULL,
  benefits TEXT NOT NULL,
  risk TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  farm TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  modules INT NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  badge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id INT NOT NULL,
  client_id TEXT NOT NULL,
  PRIMARY KEY (post_id, client_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS follows (
  client_id TEXT NOT NULL,
  farmer TEXT NOT NULL,
  PRIMARY KEY (client_id, farmer)
);

-- Store uploaded media in DB for persistence on ephemeral hosts (e.g. Render)
CREATE TABLE IF NOT EXISTS uploads (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
