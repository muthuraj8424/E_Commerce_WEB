import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation in React Router v6

function Cart() {
  const { cart, addToCart, decreaseQuantity, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate(); // Initialize navigate function

  // Navigate to the checkout page
  const handleCheckout = () => {
    navigate("/user/checkout"); // Redirect to the checkout page
  };

  return (
    <div className="p-4 md:p-6 m-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((product) => (
            <div key={product._id} className="border border-gray-300 rounded-lg p-4 shadow-md">
              <img
                src={`https://e-com-backend-65l1.onrender.com${product.photos[0]}`}
                alt={product.name}
                className="w-full h-40 md:h-48 mb-4 object-cover rounded-lg shadow-md"
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-sm md:text-base text-gray-600 mb-2">{product.description}</p>
              <p className="text-gray-800 font-medium mb-4">Price: Rs{product.price}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => decreaseQuantity(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-gray-800 font-medium">{product.quantity}</span>
                <button
                  onClick={() => updateQuantity(product._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(product._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 w-full"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">Your cart is empty.</p>
      )}

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
