const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Frontend path: check several common locations and prefer one containing index.html
const candidates = [
  path.join(__dirname, "..", "build"),
  path.join(path.resolve(__dirname, ".."), "build"),
  path.join(process.cwd(), "build"),
  path.resolve(process.cwd(), "build"),
  path.join(__dirname, "..", "frontend"),
  path.join(path.resolve(__dirname, ".."), "frontend"),
  path.join(process.cwd(), "frontend"),
  path.resolve(process.cwd(), "frontend"),
  path.join("/app", "build"),
  path.join("/app", "frontend"),
  path.join("/", "build"),
  path.join("/", "frontend"),
];

function findFrontendPath() {
  for (const p of candidates) {
    try {
      if (fs.existsSync(path.join(p, "index.html"))) return p;
    } catch (err) {
      // ignore
    }
  }
  // If no index.html found, pick the first existing candidate directory
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (err) {
      // ignore
    }
  }
  // fallback to the original relative frontend
  return path.join(__dirname, "..", "frontend");
}

const frontendPath = findFrontendPath();
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// SPA fallback: serve index.html for any non-API GET route
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.log("Error serving index.html:", err.message);
      res.status(500).send("Error loading frontend");
    }
  });
});


// MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
} else {
  console.log("MONGO_URI is not defined. Skipping database connection.");
}


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

