const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the User model
    required: true 
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      Productname: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  
  location: { type: String, required: true },  // Make sure location is a string (address/region)
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'completed', 'shipped', 'cancelled']  // Enum for order status
  },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
