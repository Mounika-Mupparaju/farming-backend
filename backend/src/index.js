const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const db = require('./db-loader');
const { UPLOAD_DIR } = require('./uploads');

const postsRouter = require('./routes/posts');
const guidesRouter = require('./routes/guides');
const equipmentRouter = require('./routes/equipment');
const workersRouter = require('./routes/workers');
const jobsRouter = require('./routes/jobs');
const productsRouter = require('./routes/products');
const salesRouter = require('./routes/sales');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.FRONTEND_URL) {
  try {
    const u = new URL(process.env.FRONTEND_URL);
    const origin = `${u.protocol}//${u.host}`;
    corsOrigins.push(origin);
  } catch {
    corsOrigins.push(process.env.FRONTEND_URL);
  }
}
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

// Serve uploaded files: from DB when using Postgres, from disk otherwise
if (db.getUpload) {
  app.get('/uploads/:id', async (req, res) => {
    try {
      const row = await db.getUpload(req.params.id);
      if (!row) return res.status(404).end();
      res.setHeader('Content-Type', row.mimetype);
      res.send(row.data);
    } catch (e) {
      res.status(500).end();
    }
  });
} else {
  app.use('/uploads', express.static(UPLOAD_DIR));
}

// POST /api/posts - create post (with optional file upload)
const postUpload = multer({
  storage: db.saveUpload
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
          const ext = /video\/|\.mp4$/i.test(file.mimetype + file.originalname) ? '.mp4' : path.extname(file.originalname) || '.jpg';
          cb(null, 'media-' + Date.now() + ext);
        },
      }),
  limits: { fileSize: db.saveUpload ? 5 * 1024 * 1024 : 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/|video\//.test(file.mimetype)) cb(null, true);
    else cb(null, false);
  },
});
app.post('/api/posts', postUpload.single('media'), async (req, res) => {
  try {
    const farmer = (req.body && req.body.farmer) ? String(req.body.farmer).trim() : 'My Farm';
    const location = (req.body && req.body.location) ? String(req.body.location).trim() : '';
    const type = (req.body && req.body.type) ? String(req.body.type).trim() : 'Photo';
    const title = (req.body && req.body.title) ? String(req.body.title).trim() : '';
    const description = (req.body && req.body.description) ? String(req.body.description).trim() : '';
    const tagsStr = (req.body && req.body.tags) ? String(req.body.tags).trim() : '';
    const tags = tagsStr ? tagsStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
    if (!title) return res.status(400).json({ error: 'title is required' });
    let mediaUrl = null;
    if (req.file) {
      if (db.saveUpload) {
        const ext = /video\/|\.mp4$/i.test(req.file.mimetype + (req.file.originalname || '')) ? '.mp4' : path.extname(req.file.originalname || '') || '.jpg';
        const filename = 'media-' + Date.now() + ext;
        const id = await db.saveUpload(filename, req.file.mimetype, req.file.buffer);
        mediaUrl = '/uploads/' + id;
      } else {
        mediaUrl = '/uploads/' + req.file.filename;
      }
    }
    const posts = await db.getTable('posts');
    const nextId = posts.length ? Math.max(...posts.map((r) => r.id)) + 1 : 1;
    const newPost = { id: nextId, farmer, location, type: type === 'Video' ? 'Video' : 'Photo', title, description, tags, mediaUrl };
    await db.setTable('posts', [...posts, newPost]);
    res.status(201).json({ ...newPost, likeCount: 0, commentCount: 0, isLiked: false, isFollowing: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/posts', postsRouter);
app.use('/api/guides', guidesRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/workers', workersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/courses', coursesRouter);

app.get('/api/health', async (req, res) => {
  try {
    if (db.get) {
      const g = db.get();
      if (g && typeof g.then === 'function') await g;
    }
    res.json({ ok: true, db: db.isPg ? 'postgres' : 'json' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

async function start() {
  const result = db.init();
  if (result && typeof result.then === 'function') await result;
  app.listen(PORT, () => {
    console.log(`AgroVibes API running at http://localhost:${PORT}`);
  });
}
start().catch((e) => {
  console.error(e);
  process.exit(1);
});
