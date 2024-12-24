const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    stock: { type: Number, required: true },
    photos: { type: [String], required: true }, // Array of image URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
