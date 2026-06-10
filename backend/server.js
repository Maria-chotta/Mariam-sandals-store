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

// Frontend path
const frontendPath = path.join(__dirname, "..", "frontend");
console.log("Serving frontend from:", frontendPath);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve frontend files and SPA routes
app.get("*", (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith("/api")) {
    return next();
  }
  
  // Try to serve the requested file
  const filePath = path.join(frontendPath, req.path === "/" ? "index.html" : req.path);
  
  res.sendFile(filePath, (err) => {
    // If file not found, serve index.html for SPA routing
    if (err) {
      const indexPath = path.join(frontendPath, "index.html");
      res.sendFile(indexPath, (indexErr) => {
        if (indexErr) {
          console.log("Error serving index.html:", indexErr.message);
          res.status(500).send("Error loading frontend");
        }
      });
    }
  });
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
