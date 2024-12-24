import React, { useState } from "react";
import axios from "axios";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission to fetch order details
  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setOrderDetails(null);

    if (!orderId.trim()) {
      setErrorMessage("Please enter a valid Order ID.");
      return;
    }

    try {
      const response = await axios.get(`/api/orders/getOrders/${orderId}`);
      setOrderDetails(response.data.order);
      setOrderId("")
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error fetching order details."
      );
    }
  };

  return (
    <div className="p-6 container mx-auto min-h-screen flex flex-col items-center justify-center ml-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-600">
        Track Your Order
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-lg flex flex-col gap-4 mb-6"
      >
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Search Order
        </button>
      </form>

      {/* Display Results */}
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      {orderDetails && (
        <div className="w-full max-w-3xl border border-gray-300 rounded-lg p-6 shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            Order Details
          </h2>

          <p className="text-gray-700 mb-2">
            <strong>Order ID:</strong> {orderDetails._id}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Status:</strong> {orderDetails.status}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Total Amount:</strong> Rs-{orderDetails.totalAmount}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Delivery Location:</strong> {orderDetails.location}
          </p>

          <h3 className="text-xl font-semibold mb-2 text-gray-800">Products:</h3>
          <ul className="list-disc pl-6">
            {orderDetails.items.map((item) => (
              <li key={item._id} className="text-gray-700 mb-2">
                {item.Productname} - {item.quantity} pcs @ Rs-{item.price} each
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;