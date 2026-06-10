const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the frontend directory
const frontendPath = path.join(__dirname, "..", "frontend");
console.log("Serving static files from:", frontendPath);
app.use(express.static(frontendPath));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Fallback: serve index.html for any non-API request (SPA routing)
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
  } else {
    next();
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});