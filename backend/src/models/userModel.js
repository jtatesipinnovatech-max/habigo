const pool = require('../config/db');

// Buscar usuario por email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0];
};

// Crear usuario con role
const createUser = async (email, password, role = 'guest') => {
  const result = await pool.query(
    `INSERT INTO users (email, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role`,
    [email, password, role]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser
};