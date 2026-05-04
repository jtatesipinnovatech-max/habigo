const pool = require('../config/db');

// ===============================
// 🔍 Obtener propiedades
// ===============================
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


// ===============================
// 🏡 Crear propiedad
// ===============================
const createProperty = async ({
  title,
  description,
  city,
  price,
  user_id,
  address,
  image,
  max_guests
}) => {
  const result = await pool.query(
    `INSERT INTO properties
     (title, description, city, price, user_id, address, image, max_guests)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      title,
      description,
      city,
      price,
      user_id,
      address,
      image,
      max_guests || 1 // 🔥 valor por defecto
    ]
  );

  return result.rows[0];
};


// ===============================
// 👤 Propiedades por usuario
// ===============================
const getPropertiesByUser = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM properties WHERE user_id = $1',
    [user_id]
  );

  return result.rows;
};


// ===============================
// ✏️ Actualizar propiedad
// ===============================
const updateProperty = async (id, user_id, data) => {
  const {
    title,
    description,
    city,
    price,
    address,
    image,
    max_guests
  } = data;

  const result = await pool.query(
    `UPDATE properties
     SET title=$1,
         description=$2,
         city=$3,
         price=$4,
         address=$5,
         image=$6,
         max_guests=$7
     WHERE id=$8 AND user_id=$9
     RETURNING *`,
    [
      title,
      description,
      city,
      price,
      address,
      image,
      max_guests || 1,
      id,
      user_id
    ]
  );

  return result.rows[0];
};


// ===============================
// 🗑️ Eliminar propiedad
// ===============================
const deleteProperty = async (id, user_id) => {
  const result = await pool.query(
    `DELETE FROM properties
     WHERE id=$1 AND user_id=$2
     RETURNING *`,
    [id, user_id]
  );

  return result.rows[0];
};


// ===============================
// 📦 EXPORTS
// ===============================
module.exports = {
  getAllProperties,
  createProperty,
  getPropertiesByUser,
  updateProperty,
  deleteProperty
};