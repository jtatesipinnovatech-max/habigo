const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.json({ message: 'Usuario registrado en DB 🔥' });

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login' });
  }
};

module.exports = { register, login };