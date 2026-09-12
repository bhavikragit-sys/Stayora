const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireOwnership = require("../middleware/requireOwnership");
const { upload } = require("../config/cloudinary");

const {
  getAllListings,
  getListingById,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();
// GET all listings  PUBLIC
router.get("/", getAllListings);

// GET My Listing
router.get("/me", requireAuth, getMyListings);

// GET listing by ID  PUBLIC
router.get("/:id", getListingById);

// POST new listing PRIVATE
router.post("/", requireAuth, upload.array("imageFiles"), createListing);

// PUT existing listing  PRIVATE + OWNER
router.put("/:id", requireAuth, requireOwnership, upload.array("imageFiles"), updateListing);

// DELETE listing  PRIVATE + OWNER
router.delete("/:id", requireAuth, requireOwnership, deleteListing);

module.exports = router;

