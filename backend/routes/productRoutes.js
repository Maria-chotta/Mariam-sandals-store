const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const defaultProducts = require("../data/defaultProducts");

function getUsableCatalogProducts(products) {
  return products.filter(product => {
    return product.name &&
      Number(product.price) > 0 &&
      typeof product.image === "string" &&
      product.image.startsWith("images/");
  });
}


// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(defaultProducts);
    }

    const products = await Product.find();
    const usableProducts = getUsableCatalogProducts(products);

    if (!usableProducts.length) {
      return res.json(defaultProducts);
    }

    res.json(usableProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      category: req.body.category,
      sizes: req.body.sizes
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
