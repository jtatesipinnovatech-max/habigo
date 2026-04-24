const pool = require('../config/db');

// Crear reseña
const createReview = async ({
  property_id,
  user_id,
  booking_id,
  rating,
  comment
}) => {
  const result = await pool.query(
    `INSERT INTO reviews
    (property_id, user_id, booking_id, rating, comment)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [property_id, user_id, booking_id, rating, comment]
  );

  return result.rows[0];
};

// Reseñas por propiedad
const getReviewsByProperty = async (property_id) => {
  const result = await pool.query(
    `SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.property_id = $1
     ORDER BY r.created_at DESC`,
    [property_id]
  );

  return result.rows;
};

// Promedio rating
const getAverageRating = async (property_id) => {
  const result = await pool.query(
    `SELECT
      ROUND(AVG(rating)::numeric,1) AS average,
      COUNT(*) AS total
     FROM reviews
     WHERE property_id = $1`,
    [property_id]
  );

  return result.rows[0];
};

// Validar booking terminado
const checkCompletedBooking = async (
  booking_id,
  user_id
) => {
  const result = await pool.query(
    `SELECT *
     FROM bookings
     WHERE id = $1
     AND user_id = $2
     AND end_date < NOW()`,
    [booking_id, user_id]
  );

  return result.rows[0];
};

module.exports = {
  createReview,
  getReviewsByProperty,
  getAverageRating,
  checkCompletedBooking
};