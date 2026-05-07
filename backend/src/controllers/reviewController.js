const ReviewModel = require('../models/reviewModel');


// =====================================
// CREAR RESEÑA
// =====================================

const postReview = async (req, res) => {

  const {
    property_id,
    booking_id,
    rating,
    comment
  } = req.body;

  const user_id = req.user.id;

  try {

    // VALIDACIONES
    if (
      !property_id ||
      !booking_id ||
      !rating
    ) {

      return res.status(400).json({
        error:
          'property_id, booking_id y rating requeridos'
      });
    }

    // RATING
    if (
      rating < 1 ||
      rating > 5
    ) {

      return res.status(400).json({
        error:
          'Rating debe ser entre 1 y 5'
      });
    }

    // BOOKING TERMINADO
    const booking =
      await ReviewModel.checkCompletedBooking(
        booking_id,
        user_id
      );

    if (!booking) {

      return res.status(403).json({
        error:
          'Solo puedes reseñar reservas finalizadas'
      });
    }

    // CREAR
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

    // UNIQUE
    if (error.code === '23505') {

      return res.status(409).json({
        error:
          'Ya reseñaste esta reserva'
      });
    }

    res.status(500).json({
      error:
        'Error creando reseña'
    });
  }
};


// =====================================
// OBTENER RESEÑAS
// =====================================

const getPropertyReviews = async (
  req,
  res
) => {

  const { id } = req.params;

  try {

    const reviews =
      await ReviewModel.getReviewsByProperty(id);

    const stats =
      await ReviewModel.getAverageRating(id);

    res.json({

      average:
        stats.average || 0,

      total:
        stats.total || 0,

      reviews

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        'Error obteniendo reseñas'
    });
  }
};


// =====================================
// VALIDAR SI PUEDE RESEÑAR
// =====================================

const canReview = async (
  req,
  res
) => {

  const user_id = req.user.id;

  const { property_id } = req.params;

  try {

    const booking =
      await ReviewModel.getReviewableBooking(
        property_id,
        user_id
      );

    res.json({

      canReview: !!booking,

      bookingId:
        booking?.id || null

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        'Error validando reseña'
    });
  }
};


// =====================================
// EXPORTS
// =====================================

module.exports = {
  postReview,
  getPropertyReviews,
  canReview
};