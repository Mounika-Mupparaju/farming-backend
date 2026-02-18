const express = require('express');
const db = require('../db-loader');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await db.getTable('guides');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
