const pool = require('../config/db');

// Obtener propiedades
const getAllProperties = async (city) => {
  let query = 'SELECT * FROM properties';
  let values = [];

  if (city) {
    query += ' WHERE LOWER(city) LIKE $1';
    values.push(`%${city.toLowerCase()}%`);
  }

  const result = await pool.query(query, values);
  return result.rows;
};

// Crear propiedad
const createProperty = async ({
  title,
  description,
  city,
  price,
  user_id,
  lat,
  lng,
  image
}) => {
  const result = await pool.query(
    `INSERT INTO properties
    (title, description, city, price, user_id, lat, lng, image)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [title, description, city, price, user_id, lat, lng, image]
  );

  return result.rows[0];
};

// Propiedades por usuario
const getPropertiesByUser = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM properties WHERE user_id = $1',
    [user_id]
  );

  return result.rows;
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertiesByUser
};