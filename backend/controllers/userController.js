const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const Listing = require("../models/listing");

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate user ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Find user

    const user = await User.findById(id).select(
      "name email createdAt"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Count user's listings

    const listingCount = await Listing.countDocuments({
      owner: id,
    });

    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        listingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, email, password } = req.body;

    // At least one field must be provided

    if (
      name === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return res.status(400).json({
        message: "At least one field is required",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update name

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name must be a non-empty string",
        });
      }

      user.name = name.trim();
    }

    // Update email

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          message: "Email must be a non-empty string",
        });
      }

      user.email = email.trim().toLowerCase();
    }

    // Update password

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Duplicate email

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateMyProfile,
};