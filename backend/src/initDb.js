// Initialize database with seed data (writes database/data.json if missing).
const { init } = require('./db');
init();
console.log('Database initialized. See database/data.json');
