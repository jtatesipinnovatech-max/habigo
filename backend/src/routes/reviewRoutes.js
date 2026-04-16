const express = require('express');
const router = express.Router();
const { postReview, getPropertyReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); // el que ya tienes

router.post('/', authMiddleware, postReview);                          // crear reseña
router.get('/property/:id', getPropertyReviews);                      // ver reseñas de una propiedad

module.exports = router;