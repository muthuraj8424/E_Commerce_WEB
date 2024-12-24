const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
// const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/individualOrders", async (req, res) => {
  console.log(req.body);

  const { user, items, location, total } = req.body; // Assuming cart items are passed from frontend
  // let totalAmount = 0;  // Initialize totalAmount
  const orderItems = []; // Initialize orderItems array

  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: `Not enough stock for ${product.name}` });
    }

    // Update stock quantity in product
    product.stock -= item.quantity;
    await product.save();

    // Add item to order, now including the product name in the orderItems
    orderItems.push({
      product: product._id,
      Productname: product.name, // Include product name here
      quantity: item.quantity,
      price: product.price,
    });

    // Add to total amount
    // totalAmount += product.price * item.quantity;
  }

  // Create the order object, no need for Productname here as it's in orderItems
  const order = new Order({
    user,
    items: orderItems,
    location, // Include location in the order
    totalAmount: total, // The total amount of the order
    status: "pending",
  });

  try {
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

// Route to place an order
router.post("/placeOrder", async (req, res) => {
  console.log(req.body);

  const { user, items, location } = req.body; // Assuming cart items are passed from frontend
  let totalAmount = 0; // Initialize totalAmount
  const orderItems = []; // Initialize orderItems array

  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: `Not enough stock for ${product.name}` });
    }

    // Update stock quantity in product
    product.stock -= item.quantity;
    await product.save();

    // Add item to order, now including the product name in the orderItems
    orderItems.push({
      product: product._id,
      Productname: product.name, // Include product name here
      quantity: item.quantity,
      price: product.price,
    });

    // Add to total amount
    totalAmount += product.price * item.quantity;
  }

  // Create the order object, no need for Productname here as it's in orderItems
  const order = new Order({
    user,
    items: orderItems,
    location, // Include location in the order
    totalAmount, // The total amount of the order
    status: "pending",
  });

  try {
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

// Place an order (User)
router.post("/", async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    // Verify products
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    // Create the order
    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalAmount,
    });

    await newOrder.save();

    // Reduce stock after order
    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get order history for a user (User)
router.get("/:id", async (req, res) => {
  console.log("in userorder " + req.params.userId);
  const { id } = req.params;
  console.log("usergetprodid " + id);

  try {
    // Fetch orders based on userId
    const orders = await Order.find({ user: id });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found" }); // Return early if no orders
    }

    // Send the orders if found
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update order status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an order (Admin)


router.get("/getOrders/:id", async (req, res) => {
  console.log(req.params.id);
  
  try {
    const order = await Order.findById(req.params.id);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Respond with the retrieved order
    res.status(200).json({ message: "Fetched Successfully", order });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
