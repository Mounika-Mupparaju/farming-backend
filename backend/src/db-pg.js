/**
 * PostgreSQL backend for AgroVibes. Used when DATABASE_URL is set (e.g. on Render).
 * Exports same interface as db.js but async (getTable/setTable/init return Promises).
 */
const { Pool } = require('pg');
const seedData = require('./seedData');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const TABLE_COLUMNS = {
  posts: ['id', 'farmer', 'location', 'type', 'title', 'description', 'tags', 'media_url'],
  guides: ['id', 'title', 'level', 'duration'],
  equipment: ['id', 'name', 'mode', 'price', 'location', 'includes_operator'],
  workers: ['id', 'name', 'skills', 'experience', 'availability', 'location'],
  jobs: ['id', 'title', 'location', 'type'],
  products: ['id', 'name', 'type', 'type_key', 'crops', 'benefits', 'risk'],
  sales_items: ['id', 'name', 'farm', 'price', 'location', 'tags'],
  courses: ['id', 'title', 'modules', 'progress', 'badge'],
  post_likes: ['post_id', 'client_id'],
  post_comments: ['id', 'post_id', 'author', 'text', 'created_at'],
  follows: ['client_id', 'farmer'],
};

// Columns stored as JSONB in Postgres must be sent as JSON strings
const JSONB_COLUMNS = { posts: ['tags'], workers: ['skills'], sales_items: ['tags'] };

function safeTags(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToPost(r) {
  if (!r) return null;
  return {
    id: r.id,
    farmer: r.farmer || '',
    location: r.location || '',
    type: r.type || 'Photo',
    title: r.title || '',
    description: r.description || '',
    tags: safeTags(r.tags),
    mediaUrl: r.media_url || null,
  };
}

function rowToEquipment(r) {
  return {
    id: r.id,
    name: r.name,
    mode: r.mode,
    modeKey: r.mode,
    price: r.price,
    location: r.location || '',
    includesOperator: Boolean(r.includes_operator),
  };
}

function rowToWorker(r) {
  return {
    id: r.id,
    name: r.name,
    skills: Array.isArray(r.skills) ? r.skills : (r.skills || []),
    experience: r.experience,
    availability: r.availability,
    location: r.location,
  };
}

function rowToSales(r) {
  return {
    id: r.id,
    name: r.name,
    farm: r.farm,
    price: r.price,
    location: r.location || '',
    tags: Array.isArray(r.tags) ? r.tags : (r.tags || []),
  };
}

function rowToComment(r) {
  return {
    id: r.id,
    postId: r.post_id,
    author: r.author,
    text: r.text,
    createdAt: r.created_at,
  };
}

async function runSchema() {
  const path = require('path');
  const fs = require('fs');
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema-pg.sql');
  if (!fs.existsSync(schemaPath)) return;
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
}

async function seed() {
  const data = seedData();
  const client = await pool.connect();
  try {
    for (const row of data.posts) {
      await client.query(
        `INSERT INTO posts (id, farmer, location, type, title, description, tags, media_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, row.farmer, row.location, row.type, row.title, row.description || '', JSON.stringify(row.tags || [])]
      );
    }
    for (const row of data.guides) {
      await client.query(
        'INSERT INTO guides (id, title, level, duration) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [row.id, row.title, row.level, row.duration]
      );
    }
    for (const row of data.equipment) {
      await client.query(
        'INSERT INTO equipment (id, name, mode, price, location, includes_operator) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [row.id, row.name, row.mode, row.price, row.location || '', Boolean(row.includesOperator)]
      );
    }
    for (const row of data.workers) {
      await client.query(
        'INSERT INTO workers (id, name, skills, experience, availability, location) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [row.id, row.name, JSON.stringify(row.skills || []), row.experience, row.availability, row.location]
      );
    }
    for (const row of data.jobs) {
      await client.query(
        'INSERT INTO jobs (id, title, location, type) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [row.id, row.title, row.location, row.type]
      );
    }
    for (const row of data.products) {
      await client.query(
        'INSERT INTO products (id, name, type, type_key, crops, benefits, risk) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
        [row.id, row.name, row.type, row.typeKey || row.type, row.crops, row.benefits, row.risk]
      );
    }
    for (const row of data.sales_items) {
      await client.query(
        'INSERT INTO sales_items (id, name, farm, price, location, tags) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [row.id, row.name, row.farm, row.price, row.location || '', JSON.stringify(row.tags || [])]
      );
    }
    for (const row of data.courses) {
      await client.query(
        'INSERT INTO courses (id, title, modules, progress, badge) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [row.id, row.title, row.modules, row.progress, row.badge]
      );
    }
    // Reset sequences so next inserts get correct ids
    for (const table of ['posts', 'guides', 'equipment', 'workers', 'jobs', 'products', 'sales_items', 'courses']) {
      await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT COALESCE(MAX(id), 1) FROM ${table}))`);
    }
  } finally {
    client.release();
  }
}

async function init() {
  await runSchema();
  const r = await pool.query('SELECT COUNT(*) AS n FROM posts');
  if (Number(r.rows[0].n) === 0) await seed();
  return pool;
}

async function get() {
  return pool;
}

async function getTable(name) {
  const key = name === 'sales' ? 'sales_items' : name;
  if (!TABLE_COLUMNS[key]) return [];
  const orderBy =
    key === 'post_likes' || key === 'follows'
      ? TABLE_COLUMNS[key][0]
      : 'id';
  const res = await pool.query(`SELECT * FROM ${key} ORDER BY ${orderBy}`);
  const rows = res.rows;
  if (key === 'posts') return rows.map(rowToPost).filter(Boolean);
  if (key === 'equipment') return rows.map(rowToEquipment);
  if (key === 'workers') return rows.map(rowToWorker);
  if (key === 'sales_items') return rows.map(rowToSales);
  if (key === 'post_comments') return rows.map(rowToComment);
  if (key === 'post_likes') return rows.map((r) => ({ postId: r.post_id, clientId: r.client_id }));
  if (key === 'follows') return rows.map((r) => ({ clientId: r.client_id, farmer: r.farmer }));
  if (key === 'products') return rows.map((r) => ({ ...r, typeKey: r.type_key }));
  return rows;
}

async function setTable(name, rows) {
  const key = name === 'sales' ? 'sales_items' : name;
  if (!TABLE_COLUMNS[key] || key === 'post_likes' || key === 'follows') {
    if (key === 'post_likes') {
      await pool.query('DELETE FROM post_likes');
      for (const row of rows) {
        await pool.query('INSERT INTO post_likes (post_id, client_id) VALUES ($1, $2)', [row.postId, row.clientId]);
      }
    } else if (key === 'follows') {
      await pool.query('DELETE FROM follows');
      for (const row of rows) {
        await pool.query('INSERT INTO follows (client_id, farmer) VALUES ($1, $2)', [row.clientId, row.farmer]);
      }
    }
    return;
  }
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM ${key}`);
    const toCamel = (s) => s.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    const jsonbCols = JSONB_COLUMNS[key] || [];
    for (const row of rows) {
      const cols = TABLE_COLUMNS[key];
      const vals = cols.map((c) => {
        const v = row[c] !== undefined ? row[c] : row[toCamel(c)];
        if (jsonbCols.includes(c)) {
          return typeof v === 'string' ? v : JSON.stringify(v == null ? [] : v);
        }
        return v;
      });
      const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(`INSERT INTO ${key} (${cols.join(', ')}) VALUES (${placeholders})`, vals);
    }
  } finally {
    client.release();
  }
}

async function saveUpload(filename, mimetype, buffer) {
  const r = await pool.query(
    'INSERT INTO uploads (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id',
    [filename, mimetype, buffer]
  );
  return r.rows[0].id;
}

async function getUpload(id) {
  const r = await pool.query('SELECT filename, mimetype, data FROM uploads WHERE id = $1', [id]);
  return r.rows[0] || null;
}

module.exports = {
  init,
  get,
  getTable,
  setTable,
  saveUpload,
  getUpload,
  isPg: true,
};
