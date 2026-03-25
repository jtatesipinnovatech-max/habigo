const express = require('express');
const router = express.Router();

const { createBooking, getMyBookings, deleteBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getMyBookings);
router.delete('/:id', authMiddleware, deleteBooking);

module.exports = router;