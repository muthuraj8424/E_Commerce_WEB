const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// Manage Products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
router.post("/products", async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    const product = new Product({ name, price, description, stock });
    await product.save();
    res.json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

router.put("/editProducts/:id", async (req, res) => {
  console.log(req.body);
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    res.json(updatedProduct); // Send the updated product back to the client
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Manage Orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/:orderId", async (req, res) => {
  try{
  const { status } = req.body;
    const { orderId } = req.params;

    // Validate status
    if (!["pending", "completed", "shipped", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Return the updated order
    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/overview', async (req, res) => {
  try {
    // Get total count of users
    const totalUsers = await User.countDocuments();
    // Get total count of products
    const totalProducts = await Product.countDocuments();
    // Get total count of orders
    const totalOrders = await Order.countDocuments();
  
    // Respond with the aggregated data
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});



module.exports = router;
