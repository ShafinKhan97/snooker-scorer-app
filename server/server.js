const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection - this will run on each serverless function call
// In production, you might want to cache the connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/snooker-scorer",
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
