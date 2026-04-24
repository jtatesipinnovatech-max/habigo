const PropertyModel = require('../models/propertyModel');

// Obtener propiedades
const getProperties = async (req, res) => {
  try {
    const data = await PropertyModel.getAllProperties(req.query.city);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo propiedades' });
  }
};

// Crear propiedad
const createProperty = async (req, res) => {
  try {
    const property = await PropertyModel.createProperty({
      ...req.body,
      user_id: 1 // temporal
    });

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando propiedad' });
  }
};

// Mis propiedades
const getMyProperties = async (req, res) => {
  try {
    const data = await PropertyModel.getPropertiesByUser(1); // temporal
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo propiedades del usuario' });
  }
};

module.exports = {
  getProperties,
  createProperty,
  getMyProperties
};