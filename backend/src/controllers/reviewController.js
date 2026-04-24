const ReviewModel = require('../models/reviewModel');

// Crear reseña
const postReview = async (req, res) => {
  const { property_id, booking_id, rating, comment } = req.body;
  const user_id = req.user.id;

  try {
    if (!property_id || !booking_id || !rating) {
      return res.status(400).json({
        error: 'property_id, booking_id y rating requeridos'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating debe ser entre 1 y 5'
      });
    }

    const booking =
      await ReviewModel.checkCompletedBooking(
        booking_id,
        user_id
      );

    if (!booking) {
      return res.status(403).json({
        error: 'Solo puedes reseñar reservas finalizadas'
      });
    }

    const review =
      await ReviewModel.createReview({
        property_id,
        user_id,
        booking_id,
        rating,
        comment
      });

    res.status(201).json(review);

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya reseñaste esta reserva'
      });
    }

    res.status(500).json({
      error: 'Error creando reseña'
    });
  }
};

// Obtener reseñas propiedad
const getPropertyReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews =
      await ReviewModel.getReviewsByProperty(id);

    const stats =
      await ReviewModel.getAverageRating(id);

    res.json({
      average: stats.average,
      total: stats.total,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error obteniendo reseñas'
    });
  }
};

module.exports = {
  postReview,
  getPropertyReviews
};