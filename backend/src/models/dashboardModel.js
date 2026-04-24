const pool = require('../config/db');

// Total propiedades del usuario
const getTotalProperties = async (user_id) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM properties WHERE user_id = $1',
    [user_id]
  );

  return Number(result.rows[0].count);
};

// Total reservas del usuario
const getTotalBookings = async (user_id) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM bookings WHERE user_id = $1',
    [user_id]
  );

  return Number(result.rows[0].count);
};

module.exports = {
  getTotalProperties,
  getTotalBookings
};