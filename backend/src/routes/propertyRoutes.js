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
const roleMiddleware = require('../middlewares/roleMiddleware');


// Obtener propiedades públicas
router.get('/', getProperties);


// Solo usuarios host pueden crear propiedades
router.post(
  '/',
  authMiddleware,
  roleMiddleware('host'),
  createProperty
);


// Mis propiedades del usuario logueado
router.get(
  '/my',
  authMiddleware,
  getMyProperties
);


module.exports = router;