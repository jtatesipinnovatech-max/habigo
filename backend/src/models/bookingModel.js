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

// Reservas por usuario
const getBookingsByUser = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM bookings WHERE user_id = $1',
    [user_id]
  );

  return result.rows;
};

module.exports = {
  checkBookingConflict,
  createBooking,
  deleteBooking,
  getBookingsByUser
};