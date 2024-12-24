import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from '../../context/UserContext';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { role, id } = useContext(UserContext);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/${userId}`);
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setError("No orders found.");
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, [id]);

  return (
    <div className="container mx-auto ml-4 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>
      {error && (
        <p className="text-red-600 text-center text-lg mb-4">{error}</p>
      )}
      {orders.length > 0 ? (
        <div className="w-full overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 border">Order ID</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="bg-white hover:bg-gray-100">
                  <td className="py-3 px-4 border whitespace-nowrap">
                    {order._id}
                  </td>
                  <td className="py-3 px-4 border">{order.status}</td>
                  <td className="py-3 px-4 border">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-3 border">Product Name</th>
                          <th className="py-2 px-3 border">Quantity</th>
                          <th className="py-2 px-3 border">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item._id} className="bg-white">
                            <td className="py-2 px-3 border">
                              {item.Productname}
                            </td>
                            <td className="py-2 px-3 border">{item.quantity}</td>
                            <td className="py-2 px-3 border">Rs:{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-4 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrders;
