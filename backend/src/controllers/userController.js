const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/userModel');

// ===============================
// 📧 VALIDADOR EMAIL
// ===============================
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ===============================
// 📝 REGISTER
// ===============================
const register = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    // 🔴 CAMPOS OBLIGATORIOS
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    // 🔴 EMAIL VÁLIDO
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Correo inválido'
      });
    }

    // 🔴 PASSWORD SEGURA
    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener mínimo 6 caracteres'
      });
    }

    // 🔍 USUARIO EXISTENTE
    const existingUser = await UserModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'El correo ya está registrado'
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 CREAR USUARIO
    const user = await UserModel.createUser(
      email,
      hashedPassword,
      role || 'guest',
      name
    );

    res.json({
      message: 'Usuario registrado correctamente',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al registrar usuario'
    });
  }
};

// ===============================
// 🔐 LOGIN
// ===============================
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔴 CAMPOS OBLIGATORIOS
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios'
      });
    }

    // 🔴 EMAIL VÁLIDO
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Correo inválido'
      });
    }

    // 🔍 BUSCAR USUARIO
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // 🧪 DEBUG (ahora sí correcto)
    console.log("INPUT PASSWORD:", password);
    console.log("HASH EN DB:", user.password);

    // 🔐 VALIDAR PASSWORD
    const valid = await bcrypt.compare(password, user.password);

    console.log("MATCH:", valid);

    if (!valid) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // 🔑 TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error en login'
    });
  }
};
const becomeHost = async (req, res) => {
  try {
    const user = await UserModel.updateRole(req.user.id, "host");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.json({
      message: "Ahora eres anfitrión",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar rol"
    });
  }
};

module.exports = {
  register,
  login,
  becomeHost
};