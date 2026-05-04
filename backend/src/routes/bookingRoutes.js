const express = require('express');
const router = express.Router();

const { createBooking, getMyBookings, deleteBooking, checkAvailability, getBookingsByProperty } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/by-property", getBookingsByProperty);
router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getMyBookings);
router.delete('/:id', authMiddleware, deleteBooking);
router.get("/check-availability", checkAvailability);

module.exports = router;