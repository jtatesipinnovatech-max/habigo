const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload");

console.log("CARGANDO PROPERTY ROUTES CORRECTO 🔥");

const {
  getProperties,
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty
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
  upload.array("images", 10),
  createProperty
);


// Mis propiedades del usuario logueado
router.get(
  '/my',
  authMiddleware,
  getMyProperties
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('host'),
  updateProperty
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('host'),
  deleteProperty
);


module.exports = router;