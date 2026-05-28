const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { customer, items, total, status } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ message: "Customer name, phone and address are required." });
  }

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order items are required." });
  }

  const newOrder = new Order({
    customer,
    items,
    total,
    status: status || "pending"
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
