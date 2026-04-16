console.log("🔥 CONTROLLER CARGADO 🔥");

const pool = require('../config/db');


// 🔹 Obtener todas las propiedades
const getProperties = async (req, res) => {
  const { city } = req.query;

  try {
    let query = 'SELECT * FROM properties';
    let values = [];

    if (city) {
      query += ' WHERE LOWER(city) LIKE $1';
      values.push(`%${city.toLowerCase()}%`);
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo propiedades' });
  }
};


// 🔹 Crear propiedad (SIN auth por ahora)
const createProperty = async (req, res) => {
  const user_id = 1; // 👈 temporal para pruebas

  const { title, description, city, price, lat, lng, image } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO properties 
      (title, description, city, price, user_id, lat, lng, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, city, price, user_id, lat, lng, image]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando propiedad' });
  }
};


// 🔹 Propiedades del usuario (temporal)
const getMyProperties = async (req, res) => {
  const user_id = 1; // 👈 temporal

  try {
    const result = await pool.query(
      'SELECT * FROM properties WHERE user_id = $1',
      [user_id]
    );

    res.json(result.rows);

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