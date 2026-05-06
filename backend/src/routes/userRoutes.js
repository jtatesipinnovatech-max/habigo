const express = require('express');
const router = express.Router();

const { register, login, becomeHost } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.put("/become-host", authMiddleware, becomeHost);

// Ruta protegida 
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

module.exports = router;