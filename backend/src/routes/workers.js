const express = require('express');
const db = require('../db-loader');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await db.getTable('workers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
