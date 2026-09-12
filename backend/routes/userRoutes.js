const express = require("express");

const {
  getUserProfile,
  updateMyProfile
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();


router.put("/me", requireAuth, updateMyProfile);


router.get("/:id", getUserProfile);


module.exports = router;