const BookingModel = require('../models/bookingModel');

// Crear reserva
const createBooking = async (req, res) => {
  const { property_id, start_date, end_date } = req.body;
  const user_id = req.user.id;

  try {
    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Fechas requeridas' });
    }

    const conflict = await BookingModel.checkBookingConflict(
      property_id,
      start_date,
      end_date
    );

    if (conflict.length > 0) {
      return res.status(400).json({
        message: 'Fechas no disponibles'
      });
    }

    const booking = await BookingModel.createBooking(
      user_id,
      property_id,
      start_date,
      end_date
    );

    res.json({
      message: 'Reserva creada 🔥',
      booking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al crear reserva'
    });
  }
};

// Eliminar reserva
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await BookingModel.deleteBooking(id, user_id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      message: 'Reserva cancelada 🔥'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al cancelar reserva'
    });
  }
};

// Mis reservas
const getMyBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const data = await BookingModel.getBookingsByUser(user_id);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al obtener reservas'
    });
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getMyBookings
};