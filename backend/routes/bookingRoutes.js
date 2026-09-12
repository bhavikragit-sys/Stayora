const express = require("express");

const {
  createBooking,
  getListingBookings,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// PUBLIC    Get booked date ranges for a listing     GET /api/listings/:id/bookings

router.get("/listings/:id/bookings", getListingBookings);

// PRIVATE      Create a booking for a listing      POST /api/listings/:id/bookings

router.post("/listings/:id/bookings", requireAuth, createBooking);

// PRIVATE    Get logged-in user's bookings     GET /api/bookings/me

router.get("/bookings/me", requireAuth, getMyBookings);

// PRIVATE + OWNER    Get a specific booking      GET /api/bookings/:id

router.get("/bookings/:id", requireAuth, getBookingById);

// PRIVATE + OWNER   Cancel a booking      PATCH /api/bookings/:id/cancel

router.patch("/bookings/:id/cancel", requireAuth, cancelBooking);

module.exports = router;