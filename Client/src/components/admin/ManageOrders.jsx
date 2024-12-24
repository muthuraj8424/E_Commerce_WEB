import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      // Update the order status in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Manage Orders</h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order._id} className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="space-y-2 sm:w-3/4">
                <p className="text-lg font-semibold text-gray-700"><strong>Order ID:</strong> {order._id}</p>
                <p className="text-sm text-gray-600"><strong>User:</strong> {order.user.name}</p>
                <p className="text-sm text-gray-600"><strong>Status:</strong> 
                  <span className={`font-medium ${order.status === 'pending' ? 'text-yellow-500' : order.status === 'completed' ? 'text-green-500' : order.status === 'shipped' ? 'text-blue-500' : 'text-red-500'}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="sm:w-1/4 w-full sm:mt-0 mt-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Change Status:</strong></p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 w-full sm:w-auto"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;
