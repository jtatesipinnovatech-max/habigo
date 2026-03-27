const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'habigo',
  password: 'Felipe123',
  port: 5432,
});

module.exports = pool;