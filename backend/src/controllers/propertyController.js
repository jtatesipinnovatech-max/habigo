const PropertyModel = require('../models/propertyModel');
const cloudinary = require("../config/cloudinary");

// 🔹 Obtener todas las propiedades (público)
const getProperties = async (req, res) => {
  try {
    const data = await PropertyModel.getAllProperties(req.query);

    console.log("DATA EN CONTROLLER:", data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo propiedades' });
  }
};

// 🔹 Crear propiedad (solo host)
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      city,
      price,
      address,
      max_guests,
      amenities
    } = req.body;

    // 🔴 VALIDACIONES
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Debes subir al menos una imagen"
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({
        error: "Máximo 10 imágenes"
      });
    }

    // 🔥 PARSEAR AMENITIES (IMPORTANTE)
    let parsedAmenities = [];

    if (amenities) {
      parsedAmenities = typeof amenities === "string"
        ? JSON.parse(amenities)
        : amenities;
    }

    // 🔥 SUBIR IMÁGENES A CLOUDINARY
    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    // 🔥 CREAR PROPIEDAD
    const property = await PropertyModel.createProperty({
      title,
      description,
      city,
      price,
      address,
      image: imageUrls,
      user_id: req.user.id,
      max_guests,
      amenities: parsedAmenities
    });

    console.log("BODY:", req.body);
    console.log("AMENITIES RAW:", req.body.amenities);

    res.json(property);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando propiedad" });
  }
};

// 🔹 Obtener propiedades del usuario (host)
const getMyProperties = async (req, res) => {
  try {
    const data = await PropertyModel.getPropertiesByUser(req.user.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error obteniendo propiedades del usuario'
    });
  }
};

// 🔹 Editar propiedad (solo dueño)
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

// 🔹 Eliminar propiedad (solo dueño)
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
      message: 'Propiedad eliminada'
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