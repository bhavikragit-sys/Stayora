const mongoose = require("mongoose");

const Review = require("../models/review");

const Booking = require("../models/booking");

const Listing = require("../models/listing");

// GET ALL REVIEWS FOR A LISTING   PUBLIC  GET /api/listings/:id/reviews

const getListingReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate listing ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    // Check if listing exists

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const reviews = await Review.find({ listing: id })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      averageRating: listing.averageRating,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE REVIEW    PRIVATE      POST /api/listings/:id/reviews

const createReview = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;
    const { bookingId, rating, comment } = req.body;

    // 1. Validate listing ID

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    // 2. Validate required booking ID

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    // 3. Validate rating

    if (
      rating === undefined ||
      rating === null ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 1 and 5",
      });
    }

    // 4. Check listing exists

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // 5. Find booking

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 6. Verify booking belongs to logged-in user

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to review this booking",
      });
    }

    // 7. Verify booking belongs to this listing

    if (booking.listing.toString() !== listingId) {
      return res.status(400).json({
        message: "Booking does not belong to this listing",
      });
    }

    // 8. Booking must be completed

    const now = new Date();

    if (new Date(booking.checkOut) > now) {
      return res.status(400).json({
        message: "You can only review a completed stay",
      });
    }

    // 9. Check if this booking already has a review

    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this booking",
      });
    }

    // 10. Create review

    const review = await Review.create({
      listing: listingId,
      author: req.user._id,
      booking: bookingId,
      rating,
      comment,
    });

    // 11. Recalculate listing rating

    const ratingStats = await Review.aggregate([
      {
        $match: {
          listing: new mongoose.Types.ObjectId(listingId),
        },
      },
      {
        $group: {
          _id: "$listing",
          averageRating: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      ratingStats.length > 0
        ? Number(ratingStats[0].averageRating.toFixed(1))
        : 0;

    const reviewCount = ratingStats.length > 0 ? ratingStats[0].reviewCount : 0;

    await Listing.findByIdAndUpdate(listingId, {
      averageRating,
      reviewCount,
    });

    // 12. Return response

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE REVIEW  PRIVATE + AUTHOR ONLY   DELETE /api/reviews/:id

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate review ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Verify author

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this review",
      });
    }

    const listingId = review.listing;

    // Delete review

    await Review.findByIdAndDelete(id);

    // Recalculate rating after deletion

    const ratingStats = await Review.aggregate([
      {
        $match: {
          listing: new mongoose.Types.ObjectId(listingId),
        },
      },
      {
        $group: {
          _id: "$listing",
          averageRating: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      ratingStats.length > 0
        ? Number(ratingStats[0].averageRating.toFixed(1))
        : 0;

    const reviewCount = ratingStats.length > 0 ? ratingStats[0].reviewCount : 0;

    await Listing.findByIdAndUpdate(listingId, {
      averageRating,
      reviewCount,
    });

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListingReviews,
  createReview,
  deleteReview,
};
