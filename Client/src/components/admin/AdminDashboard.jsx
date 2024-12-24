import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get("/api/admin/overview");
        setOverview(response.data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      }
    };
    fetchOverview();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 m-6">
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-12">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">{overview.totalUsers}</p>
            <p className="text-gray-600 mt-2">
              The total number of users registered in the system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Products</h2>
            <p className="text-3xl font-bold text-green-600">{overview.totalProducts}</p>
            <p className="text-gray-600 mt-2">
              The total number of products available in store.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Orders</h2>
            <p className="text-3xl font-bold text-yellow-600">{overview.totalOrders}</p>
            <p className="text-gray-600 mt-2">
              The total number of orders placed by customers.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <p className="text-gray-600">
            This section can include metrics or activities, like recent orders,
            new user sign-ups, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;