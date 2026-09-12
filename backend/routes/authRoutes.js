const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const { authLimiter } = require("../middleware/rateLimiters");

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

module.exports = router;
