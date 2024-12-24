import React, { useState, useContext } from 'react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import UserContext from '../../context/UserContext';

function PlaceOrder() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isProceed, setIsProceed] = useState(false);
  const [userDetails, setUserDetails] = useState({ location: '', notes: '' });
  const { role, id } = useContext(UserContext);
  const [orderId, setorderId] = useState(null)
  const { total } = useCart();
  const userId = localStorage.getItem("UserId");

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await axios.post('/api/orders/placeOrder', {
        user: id, // Replace with actual logged-in user identifier
        items: orderItems,
        location: userDetails.location,
        total: total,
      });
      setorderId(response.data?.order._id)
      console.log(response.data?.order._id);
      
      // setorderId(response.data)
      if (response.status === 201) {
        setOrderSuccess(true);
       
      }
    } catch (error) {
      setError('Failed to place the order');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 ml-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Place Your Order</h1>

      {orderSuccess ? (
        <div className="text-center text-green-500 font-semibold text-xl">Your order has been placed successfully! orderId :{orderId}</div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold text-xl">{error}</div>
      ) : isProceed ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((product) => (
              <div key={product._id} className="border border-gray-300 rounded-lg p-4 bg-white">
                <img
                  src={`https://e-com-backend-65l1.onrender.com${product.photos[0]}`}
                  alt={product.name}
                  className="w-full h-48 mb-4 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium text-gray-800 mb-4">Your Total Bill Amount: <span className="font-bold text-xl">${total}</span></p>

            <label className="block text-gray-700 font-medium mb-2">Delivery Address</label>
            <input
              type="text"
              name="location"
              value={userDetails.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter your location"
            />

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className={`bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Placing Order...' : 'Confirm and Place Order'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((product) => (
              <div key={product._id} className="border border-gray-300 rounded-lg p-4 bg-white">
                <img
                  src={`https://e-com-backend-65l1.onrender.com${product.photos[0]}`}
                  alt={product.name}
                  className="w-full h-48 mb-4 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
          <h4 className="text-xl font-bold text-gray-800 mt-6">Total Amount: ${total}</h4>
          <button
            onClick={() => setIsProceed(true)}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition mt-6"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default PlaceOrder;
