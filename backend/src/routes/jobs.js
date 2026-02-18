const express = require('express');
const db = require('../db-loader');

const router = express.Router();

function nextId(rows) {
  return rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
}

router.get('/', async (req, res) => {
  try {
    const rows = await db.getTable('jobs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, location, type } = req.body;
    if (!title || !location || !type) return res.status(400).json({ error: 'title, location, and type are required' });
    const rows = await db.getTable('jobs');
    const newRow = { id: nextId(rows), title: title.trim(), location: location.trim(), type: type.trim() };
    await db.setTable('jobs', [...rows, newRow]);
    res.status(201).json(newRow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
