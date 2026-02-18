// Use PostgreSQL when DATABASE_URL is set (e.g. on Render), otherwise JSON file store.
module.exports = process.env.DATABASE_URL ? require('./db-pg') : require('./db');
