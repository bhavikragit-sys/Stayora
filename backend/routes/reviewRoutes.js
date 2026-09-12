const express = require("express");

const {
  getListingReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// PUBLIC    GET /api/listings/:id/reviews
router.get("/listings/:id/reviews", getListingReviews);


// PROTECTED     POST /api/listings/:id/reviews
router.post("/listings/:id/reviews", requireAuth, createReview);


// PROTECTED + AUTHOR ONLY    DELETE /api/reviews/:id
router.delete("/reviews/:id", requireAuth, deleteReview);


module.exports = router;