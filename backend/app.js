const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// ../routes
const listingRoutes = require("./routes/listingRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
dotenv.config();

const app = express();

// Global Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "STAYORA API is running",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
