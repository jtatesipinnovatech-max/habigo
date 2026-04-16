const express = require('express');
const router = express.Router();
console.log("CARGANDO PROPERTY ROUTES CORRECTO 🔥");

const {
  getProperties,
  createProperty,
  getMyProperties
} = require('../controllers/propertyController');

console.log("getProperties:", getProperties);
console.log("createProperty:", createProperty);
console.log("getMyProperties:", getMyProperties);

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getProperties);
//router.post('/', authMiddleware, createProperty);
//router.get('/my', authMiddleware, getMyProperties);

module.exports = router;