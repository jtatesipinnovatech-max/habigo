const pool = require('../config/db');

// ─── QUERIES ────────────────────────────────────────────────────────────────

const createReview = async ({ property_id, user_id, booking_id, rating, comment }) => {
  const result = await pool.query(
    `INSERT INTO reviews (property_id, user_id, booking_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [property_id, user_id, booking_id, rating, comment]
  );
  return result.rows[0];
};

const getReviewsByProperty = async (property_id) => {
  const result = await pool.query(
    `SELECT 
       r.id, r.rating, r.comment, r.created_at,
       u.name AS user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.property_id = $1
     ORDER BY r.created_at DESC`,
    [property_id]
  );
  return result.rows;
};

const getAverageRating = async (property_id) => {
  const result = await pool.query(
    `SELECT 
       ROUND(AVG(rating)::numeric, 1) AS average,
       COUNT(*) AS total
     FROM reviews
     WHERE property_id = $1`,
    [property_id]
  );
  return result.rows[0];
};

// ─── CONTROLADORES ──────────────────────────────────────────────────────────

// POST /api/reviews
const postReview = async (req, res) => {
  const { property_id, booking_id, rating, comment } = req.body;
  const user_id = req.user.id; 

  if (!property_id || !booking_id || !rating) {
    return res.status(400).json({ error: 'property_id, booking_id y rating son requeridos' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'El rating debe ser entre 1 y 5' });
  }

  // Verificar que el booking le pertenece al usuario y ya terminó
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings 
     WHERE id = $1 AND user_id = $2 AND end_date < NOW()`,
    [booking_id, user_id]
  );
  if (bookingCheck.rows.length === 0) {
    return res.status(403).json({ error: 'Solo puedes reseñar reservas completadas que te pertenecen' });
  }

  try {
    const review = await createReview({ property_id, user_id, booking_id, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === '23505') { // unique violation de postgres
      return res.status(409).json({ error: 'Ya dejaste una reseña para esta reserva' });
    }
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
};

// GET /api/reviews/property/:id
const getPropertyReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const [reviews, stats] = await Promise.all([
      getReviewsByProperty(id),
      getAverageRating(id)
    ]);
    res.json({ average: stats.average, total: stats.total, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

module.exports = { postReview, getPropertyReviews };