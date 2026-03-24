const pool = require('../config/db');

const getDashboard = async (req, res) => {
  const user_id = req.user.id;

  try {
    const properties = await pool.query(
      'SELECT COUNT(*) FROM properties WHERE user_id = $1',
      [user_id]
    );

    const bookings = await pool.query(
      'SELECT COUNT(*) FROM bookings WHERE user_id = $1',
      [user_id]
    );

    res.json({
      total_properties: properties.rows[0].count,
      total_bookings: bookings.rows[0].count
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en dashboard' });
  }
};

module.exports = { getDashboard };