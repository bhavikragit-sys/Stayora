const mongoose = require("mongoose");

const Booking = require("../models/booking");

const Listing = require("../models/listing");

const {
  createBookingSchema,
} = require("../validators/bookingValidator");

// CREATE BOOKING POST PRIVATE   POST /api/listings/:id/bookings

const createBooking = async (req, res, next) => {
  try {
    // Validate request body

    const result = createBookingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid booking data",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { checkIn, checkOut, guests } = result.data;
    const { id: listingId } = req.params;

    // Validate listing ID

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    // Find listing

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Convert dates

    const startDate = new Date(`${checkIn}T00:00:00.000Z`);
    const endDate = new Date(`${checkOut}T00:00:00.000Z`);

    // Validate date range

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        message: "Check-in date cannot be in the past",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate number of guests

    if (guests > listing.maxGuests) {
      return res.status(400).json({
        message: `Maximum allowed guests is ${listing.maxGuests}`,
      });
    }

    // Check for overlapping bookings

    const overlappingBooking = await Booking.findOne({
      listing: listing._id,
      // Cancelled bookings don't block availability
      status: { $ne: "cancelled" },
      // Existing booking starts before requested booking ends
      checkIn: { $lt: endDate },
      // Existing booking ends after requested booking starts
      checkOut: { $gt: startDate },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: "Listing is already booked for these dates",
      });
    }

    // Calculate number of nights

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights =
      (endDate - startDate) / millisecondsPerDay;

    // Calculate total price on SERVER

    const totalPrice = listing.pricePerNight * nights;

    // Create booking

    const booking = await Booking.create({
      user: req.user._id,
      listing: listing._id,
      checkIn: startDate,
      checkOut: endDate,
      guests,
      totalPrice,
      status: "confirmed",
    });

    // Return booking

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// GET LISTING BOOKINGS / AVAILABILITY   GET /api/listings/:id/bookings    PUBLIC

const getListingBookings = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;

    // Validate listing ID

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    // Check that listing exists

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Find active bookings for this listing

    const bookings = await Booking.find({
      listing: listingId,
      status: "confirmed",
    })
      .select("checkIn checkOut")
      .sort({ checkIn: 1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY BOOKINGS     GET /api/bookings/me         PRIVATE

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate(
        "listing",
        "title description images pricePerNight location country"
      )
      .sort({ createdAt: -1 });

    const Review = require("../models/review");
    const userReviews = await Review.find({ author: req.user._id }).select("booking");
    const reviewedBookingIds = new Set(userReviews.map((r) => r.booking.toString()));

    const bookingsWithReviewStatus = bookings.map((booking) => ({
      ...booking.toObject(),
      isReviewed: reviewedBookingIds.has(booking._id.toString()),
    }));

    res.status(200).json({
      bookings: bookingsWithReviewStatus,
    });
  } catch (error) {
    next(error);
  }
};

//  GET SINGLE BOOKING      GET /api/bookings/:id          PRIVATE + OWNER

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate booking ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id).populate(
      "listing",
      "title description images pricePerNight location country"
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Ownership check

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this booking",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// CANCEL BOOKING  PATCH /api/bookings/:id/cancel    PRIVATE + OWNER    SOFT DELETE TO KEEP HISTORY

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate booking ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Ownership check

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this booking",
      });
    }

    // Already cancelled

    if (booking.status === "cancelled") {
      return res.status(409).json({
        message: "Booking is already cancelled",
      });
    }

    // Cannot cancel a booking whose check-in has already passed

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (booking.checkIn < today) {
      return res.status(409).json({
        message: "Past bookings cannot be cancelled",
      });
    }

    // Soft cancellation

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getListingBookings,
  getMyBookings,
  getBookingById,
  cancelBooking,
};