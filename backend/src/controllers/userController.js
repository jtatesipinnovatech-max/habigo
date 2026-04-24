const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/userModel');

// REGISTER
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario ya existe'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await UserModel.createUser(
      email,
      hashedPassword,
      role || 'guest'
    );

    res.json({
      message: 'Usuario registrado 🔥',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al registrar usuario'
    });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user =
      await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const valid =
      await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      'secreto',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error en login'
    });
  }
};

module.exports = {
  register,
  login
};