const express = require("express");
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");

router.post("/upload-photos", upload.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  console.log(req.files);

  req.files.forEach((file) => {
    const { path: tempPath, originalname } = file;
    const ext = path.extname(originalname);
    const newFileName = path.basename(tempPath) + ext;

    const newPath = path.join(uploadsDir, newFileName);

    try {
      fs.renameSync(tempPath, newPath);
      uploadedFiles.push(`/uploads/${newFileName}`);
    } catch (error) {
      console.error(`Error renaming file ${tempPath} to ${newPath}:`, error);
    }
  });
  res.json(uploadedFiles);
});
router.post("/addproducts", async (req, res) => {
  console.log(req.body);
  
  try {
    const { name, description, price, location, stock, photos } = req.body;

    // Validate required fields
    if (!name || !description || !price || !location || !stock || !photos) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      location,
      stock,
      photos,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Send a success response
    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all products
router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find();
    // console.log(products);
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Product.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Get a single product by ID
router.get("/:id", async (req, res) => {
  console.log(req.params);
  
  try {
    const product = await Product.findById(req.params.id);
    // console.log(product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a product (Admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a product (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
