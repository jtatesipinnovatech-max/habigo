const express = require('express');
const router = express.Router();
const { postReview, getPropertyReviews, canReview } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); // el que ya tienes

router.post('/', authMiddleware, postReview);                          // crear reseña
router.get('/property/:id', getPropertyReviews);                      // ver reseñas de una propiedad
router.get('/can-review/:property_id', authMiddleware, canReview);    // validar si puede reseñar

module.exports = router;