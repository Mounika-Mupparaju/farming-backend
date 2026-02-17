const path = require('path');
const fs = require('fs');

const DB_DIR = process.env.DB_PATH || path.join(__dirname, '..', '..', 'database');
const DB_FILE = path.join(DB_DIR, 'data.json');

const defaultData = {
  posts: [],
  guides: [],
  equipment: [],
  workers: [],
  jobs: [],
  products: [],
  sales_items: [],
  courses: [],
  post_likes: [],
  post_comments: [],
  follows: [],
};

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function load() {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    return JSON.parse(JSON.stringify(defaultData));
  }
  try {
    const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    Object.keys(defaultData).forEach((k) => {
      if (loaded[k] === undefined) loaded[k] = defaultData[k];
    });
    return loaded;
  } catch {
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function save(data) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let cache = null;

function get() {
  if (!cache) {
    cache = load();
    if (!cache.posts || cache.posts.length === 0) {
      const seed = require('./seedData');
      cache = seed();
      save(cache);
    }
  }
  return cache;
}

function getTable(name) {
  const key = name === 'sales' ? 'sales_items' : name;
  const data = get();
  return data[key] || [];
}

function setTable(name, rows) {
  const key = name === 'sales' ? 'sales_items' : name;
  const data = get();
  data[key] = rows;
  save(data);
  cache = data;
}

function init() {
  cache = load();
  const hasData = cache.posts && cache.posts.length > 0;
  if (!hasData) {
    const seed = require('./seedData');
    cache = seed();
    save(cache);
  }
  return cache;
}

module.exports = { get, getTable, setTable, init, load, save, DB_FILE };
