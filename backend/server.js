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

// Frontend path: check the most likely locations and pick only one that contains index.html
const candidates = [
  path.resolve(__dirname, "..", "build"),
  path.resolve(__dirname, "..", "frontend"),
  path.resolve(process.cwd(), "build"),
  path.resolve(process.cwd(), "frontend"),
];

function findFrontendPath() {
  const checks = [];

  for (const p of candidates) {
    const indexPath = path.join(p, "index.html");
    try {
      const exists = fs.existsSync(indexPath);
      checks.push(`${p} -> ${exists ? "found" : "missing"}`);
      if (exists) return p;
    } catch (err) {
      checks.push(`${p} -> error: ${err.message}`);
    }
  }

  console.log("Frontend path candidates checked:", checks);
  throw new Error(
    "No valid frontend path found. Expected build/index.html or frontend/index.html in one of the candidate directories."
  );
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

