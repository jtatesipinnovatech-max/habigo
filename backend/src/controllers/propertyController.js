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
      user_id: req.user.id
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

// Editar propiedad
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const updated = await PropertyModel.updateProperty(
      id,
      user_id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Propiedad no encontrada o no es tuya'
      });
    }

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error actualizando propiedad'
    });
  }
};

// Eliminar propiedad
const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await PropertyModel.deleteProperty(
      id,
      user_id
    );

    if (!deleted) {
      return res.status(404).json({
        message: 'Propiedad no encontrada o no es tuya'
      });
    }

    res.json({
      message: 'Propiedad eliminada '
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error eliminando propiedad'
    });
  }
};

module.exports = {
  getProperties,
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty
};