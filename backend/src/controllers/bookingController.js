const BookingModel = require('../models/bookingModel');

// Crear reserva
const createBooking = async (req, res) => {
  const { property_id, start_date, end_date } = req.body;
  const user_id = req.user.id;
  console.log("🔥 BODY:", req.body);
  console.log("🔥 USER:", req.user);

  if (!property_id) {
  return res.status(400).json({
    message: 'Propiedad requerida'
  });
}

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
      message: 'Reserva creada ',
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
//bloqueo de fechas ocupadas para el calendario.
const getBookingsByProperty = async (req, res) => {
  const { property_id } = req.query;

  try {
    const data = await BookingModel.getBookingsByProperty(property_id);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reservas" });
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

const checkAvailability = async (req, res) => {
  const { property_id, start_date, end_date } = req.query;

  try {
    if (!property_id || !start_date || !end_date) {
      return res.status(400).json({
        message: 'Faltan datos'
      });
    }

    const conflict = await BookingModel.checkBookingConflict(
      property_id,
      start_date,
      end_date
    );

    res.json({
      available: conflict.length === 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error verificando disponibilidad'
    });
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getMyBookings,
  checkAvailability,
  getBookingsByProperty 
};