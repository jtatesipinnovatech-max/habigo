const pool = require('../config/db');

// Verificar conflicto de fechas
const checkBookingConflict = async (property_id, start_date, end_date) => {
  const result = await pool.query(
    `SELECT * FROM bookings
     WHERE property_id = $1
     AND (start_date, end_date) OVERLAPS ($2, $3)`,
    [property_id, start_date, end_date]
  );

  return result.rows;
};

// Crear reserva
const createBooking = async (
  user_id,
  property_id,
  start_date,
  end_date
) => {
  const result = await pool.query(
    `INSERT INTO bookings
    (user_id, property_id, start_date, end_date)
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [user_id, property_id, start_date, end_date]
  );

  return result.rows[0];
};

// Eliminar reserva
const deleteBooking = async (id, user_id) => {
  const result = await pool.query(
    'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, user_id]
  );

  return result.rows[0];
};
const getBookingById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};
  const getBookingsByUser = async (user_id) => {
    const result = await pool.query(
      `SELECT 
          b.id,
          b.start_date,
          b.end_date,
          p.title,
          p.city,
          p.image
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.user_id = $1`,
      [user_id]
    );

    return result.rows.map(b => ({
      ...b,
      image: Array.isArray(b.image)
        ? b.image[0]
        : b.image
    }));
  };
const getBookingsByProperty = async (property_id) => {
  const result = await pool.query(
    "SELECT start_date, end_date FROM bookings WHERE property_id = $1",
    [property_id]
  );

  return result.rows;
};

module.exports = {
  createBooking,
  deleteBooking,
  getBookingsByUser,
  checkBookingConflict,
  getBookingsByProperty,
  getBookingById 
};