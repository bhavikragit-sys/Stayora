const Listing = require("../models/listing");

const requireOwnership = async (req, res, next) => {
  try {
    // Find the listing from the URL
    const listing = await Listing.findById(req.params.id);

    //  chekcing if listing doesn't exist
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check whether the logged-in user owns this listing
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not authorized to modify this listing",
      });
    }

    // Pass the listing to the controller
    req.listing = listing;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireOwnership;