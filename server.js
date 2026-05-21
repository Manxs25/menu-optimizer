const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json());

// Request logger (temporary debug)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Database Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/menu", require("./routes/menu"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Smart Menu Optimizer Backend is running");
});

// Global error handler (temporary debug)
app.use((err, req, res, next) => {
  console.error("FULL ERROR STACK:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
