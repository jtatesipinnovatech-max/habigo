const pool = require('../config/db');

// Crear reserva
const createBooking = async (req, res) => {
  const { property_id, start_date, end_date } = req.body;
  const user_id = req.user.id;

  try {
    // Validar fechas
    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Fechas requeridas' });
    }

    // Validar conflictos
    const conflict = await pool.query(
      `SELECT * FROM bookings 
       WHERE property_id = $1 
       AND (start_date, end_date) OVERLAPS ($2, $3)`,
      [property_id, start_date, end_date]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({ message: 'Fechas no disponibles' });
    }

    // Insertar
    await pool.query(
      'INSERT INTO bookings (user_id, property_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
      [user_id, property_id, start_date, end_date]
    );

    res.json({ message: 'Reserva creada 🔥' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva cancelada 🔥' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};

const getMyBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1',
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

module.exports = { createBooking, getMyBookings, deleteBooking };