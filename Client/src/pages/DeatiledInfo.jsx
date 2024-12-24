import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the CartContext
import UserContext from "../context/UserContext";

function DetailedInfo() {
  const { id } = useParams(); // Get product ID from URL params
  const { id: userid } = useContext(UserContext);
  console.log(userid);
  const userId = localStorage.getItem("UserId");

  const [product, setProduct] = useState(null); // State to store product data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [message, setmessage] = useState(null)
  const [showOrderForm, setShowOrderForm] = useState(false); // State to toggle order form
  const [deliveryLocation, setDeliveryLocation] = useState(""); // State to store delivery location
  const { addToCart, cart, decreaseQuantity, updateQuantity } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data); // Set the product data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching product"); // Set error if fetch fails
        setLoading(false); // Set loading to false if error occurs
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProduct(); // Fetch product only if id exists
    }
  }, [id]); // Add id to dependency array

  // Loading or error state handling
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-green-500 animate-spin w-16 h-16 border-4 rounded-full" role="status"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-12">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }
  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-12">
        <p className="text-xl font-semibold text-green-600"> Your order Id is : {message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const cartItem = cart.find((item) => item._id === product._id);
  const quantity = cartItem?.quantity || 0; // Ensure quantity defaults to 0

  const handleBuyNow = () => {
    setShowOrderForm(true); // Show the order form
  };

  const handleConfirmOrder = async () => {
    if (!deliveryLocation) {
      alert("Please enter a delivery location.");
      return;
    }

    try {
      const orderDetails = {
        productId: product._id,
        Productname: product.name,
        quantity: 1, // You can customize this value based on user input or logic
        price: product.price,
      };

      const response = await axios.post("/api/orders/individualOrders", {
        user: userId,
        items: [orderDetails],
        location: deliveryLocation,
        total: product.price,
      });
      alert("Order placed successfully!");
      console.log("Order response for individual orders :", response.data.order._id);
      setmessage(response.data.order._id)
      setShowOrderForm(false); // Hide the form after successful order
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl ml-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        {product.name}
      </h1>
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Product Image */}
        <div className="sm:w-1/2">
          <img
            src={`http://localhost:5000${product.photos[0]}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="sm:w-1/2">
          <p className="text-xl text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl text-gray-800 font-semibold mb-2">
            Price: Rs {product.price}
          </p>
          <p className="text-lg text-gray-700 font-medium mb-2">
            Stock: {product.stock}
          </p>
          <p className="text-lg text-gray-700 font-medium mb-4">
            Shipping Location: {product.location}
          </p>

          {/* Quantity Controls */}
          <div className="flex flex-row items-center gap-4">
            {quantity >= 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(product._id)}
                  disabled={quantity <= 0}
                  className={`px-4 py-2 rounded text-white transition ${
                    quantity > 0 ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent page reload
              addToCart(product); // Add the product to the cart
              alert(`${product.name} has been added to your cart`);
            }}
            className="bg-green-500 text-white px-4 mt-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add to Cart
          </button>
          {!showOrderForm ? (
            <button
              className="bg-blue-500 text-white px-4 mt-4 ml-3 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          ) : (
            <div className="mt-4">
              <label
                htmlFor="delivery-location"
                className="block text-lg font-medium text-gray-700"
              >
                Delivery Location:
              </label>
              <input
                id="delivery-location"
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Enter delivery location"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
              />
              <button
                className="bg-blue-500 text-white px-4 mt-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailedInfo;
