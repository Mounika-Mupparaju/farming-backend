const express = require('express');
const { getTable } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json(getTable('workers'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
