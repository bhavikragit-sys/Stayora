const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { cloudinary } = require("../config/cloudinary");

const getAllListings = async (req, res, next) => {
  try {
    const {
      location,
      country,
      minPrice,
      maxPrice,
      rating,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert pagination values

    const currentPage = Number(page);
    const itemsPerPage = Number(limit);

    // Validate pagination

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(itemsPerPage) ||
      currentPage < 1 ||
      itemsPerPage < 1
    ) {
      return res.status(400).json({
        message: "Page and limit must be positive integers",
      });
    }

    // Prevent excessively large requests

    if (itemsPerPage > 100) {
      return res.status(400).json({
        message: "Limit cannot be greater than 100",
      });
    }

    // Convert numeric filter parameters

    const min = minPrice !== undefined ? Number(minPrice) : undefined;

    const max = maxPrice !== undefined ? Number(maxPrice) : undefined;

    const minRating =
      rating !== undefined ? Number(rating) : undefined;

    // Validate numeric filter values

    if (
      (min !== undefined && !Number.isFinite(min)) ||
      (max !== undefined && !Number.isFinite(max)) ||
      (minRating !== undefined && !Number.isFinite(minRating))
    ) {
      return res.status(400).json({
        message: "Invalid price or rating filter",
      });
    }

    // Validate price values

    if (min !== undefined && min < 0) {
      return res.status(400).json({
        message: "Minimum price cannot be negative",
      });
    }

    if (max !== undefined && max < 0) {
      return res.status(400).json({
        message: "Maximum price cannot be negative",
      });
    }

    if (min !== undefined && max !== undefined && min > max) {
      return res.status(400).json({
        message: "Minimum price cannot be greater than maximum price",
      });
    }

    // Validate rating

    if (
      minRating !== undefined &&
      (minRating < 0 || minRating > 5)
    ) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5",
      });
    }

    // Build MongoDB filter

    const filter = {};

    // Location

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Country

    if (country) {
      filter.country = {
        $regex: country,
        $options: "i",
      };
    }

    // Price range

    if (min !== undefined || max !== undefined) {
      filter.pricePerNight = {};

      if (min !== undefined) {
        filter.pricePerNight.$gte = min;
      }

      if (max !== undefined) {
        filter.pricePerNight.$lte = max;
      }
    }

    // Rating

    if (minRating !== undefined) {
      filter.averageRating = {
        $gte: minRating,
      };
    }

    // Calculate how many documents to skip

    const skip = (currentPage - 1) * itemsPerPage;

    // Fetch listings + total count

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .skip(skip)
        .limit(itemsPerPage),
      Listing.countDocuments(filter),
    ]);

    // Calculate total pages

    const totalPages = Math.ceil(total / itemsPerPage);

    res.status(200).json({
      message: "Listings fetched successfully",
      listings,
      pagination: {
        total,
        page: currentPage,
        limit: itemsPerPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

const createListing = async (req, res, next) => {
  try {
    let images = [];

    // Processing  files uploaded to cloudinary via multer
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => ({
        url: file.path || file.secure_url,
        filename: file.filename || "listingimage",
      }));
      images.push(...uploadedImages);
    }

    // Process existing or manual image URLs sent in req.body
    if (req.body.images) {
      let bodyImages = req.body.images;
      if (typeof bodyImages === "string") {
        try {
          bodyImages = JSON.parse(bodyImages);
        } catch {
          bodyImages = [{ url: bodyImages }];
        }
      }
      if (Array.isArray(bodyImages)) {
        bodyImages.forEach((img) => {
          if (typeof img === "string" && img.trim() !== "") {
            images.push({ url: img, filename: "listingimage" });
          } else if (img && img.url && typeof img.url === "string" && img.url.trim() !== "") {
            images.push(img);
          }
        });
      }
    }

    const pricePerNight = req.body.pricePerNight !== undefined ? Number(req.body.pricePerNight) : undefined;
    const maxGuests = req.body.maxGuests !== undefined ? Number(req.body.maxGuests) : undefined;

    const listingData = {
      ...req.body,
      images,
      ...(pricePerNight !== undefined && { pricePerNight }),
      ...(maxGuests !== undefined && { maxGuests }),
      owner: req.user._id,
    };

    const listing = await Listing.create(listingData);

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    let images = [];

    // Process files uploaded to Cloudinary via Multer
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => ({
        url: file.path || file.secure_url,
        filename: file.filename || "listingimage",
      }));
      images.push(...uploadedImages);
    }

    // Process existing or manual image URLs sent in req.body
    if (req.body.images) {
      let bodyImages = req.body.images;
      if (typeof bodyImages === "string") {
        try {
          bodyImages = JSON.parse(bodyImages);
        } catch {
          bodyImages = [{ url: bodyImages }];
        }
      }
      if (Array.isArray(bodyImages)) {
        bodyImages.forEach((img) => {
          if (typeof img === "string" && img.trim() !== "") {
            images.push({ url: img, filename: "listingimage" });
          } else if (img && img.url && typeof img.url === "string" && img.url.trim() !== "") {
            images.push(img);
          }
        });
      }
    }

    const updateData = { ...req.body };
    if (images.length > 0) {
      // Destroy removed Cloudinary images if any were removed in the update
      if (req.listing.images && req.listing.images.length > 0) {
        const retainedUrls = new Set(images.map((img) => img.url));
        for (const oldImg of req.listing.images) {
          if (
            oldImg.filename &&
            oldImg.filename !== "listingimage" &&
            !retainedUrls.has(oldImg.url)
          ) {
            try {
              await cloudinary.uploader.destroy(oldImg.filename);
            } catch (cloudErr) {
              console.error(`Failed to delete removed Cloudinary asset ${oldImg.filename}:`, cloudErr.message);
            }
          }
        }
      }
      updateData.images = images;
    }
    if (updateData.pricePerNight !== undefined) {
      updateData.pricePerNight = Number(updateData.pricePerNight);
    }
    if (updateData.maxGuests !== undefined) {
      updateData.maxGuests = Number(updateData.maxGuests);
    }

    Object.assign(req.listing, updateData);

    await req.listing.save();

    res.status(200).json({
      message: "Listing updated successfully",
      listing: req.listing,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activeBooking = await Booking.findOne({
      listing: req.listing._id,
      status: "confirmed",
      checkOut: { $gt: today },
    });

    if (activeBooking) {
      return res.status(409).json({
        message: "Listing cannot be deleted while active bookings exist",
      });
    }

    // Delete images from Cloudinary
    if (req.listing.images && req.listing.images.length > 0) {
      for (const img of req.listing.images) {
        if (img.filename && img.filename !== "listingimage") {
          try {
            await cloudinary.uploader.destroy(img.filename);
          } catch (cloudErr) {
            console.error(`Failed to delete Cloudinary asset ${img.filename}:`, cloudErr.message);
          }
        }
      }
    }

    await req.listing.deleteOne();

    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      owner: req.user._id,
    });

    res.status(200).json({
      message: "Your listings fetched successfully",
      listings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
};