import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

function Home() {
  const { name, email, role, message, id } = useContext(UserContext);
  const [profile, setProfile] = useState(null); // Store profile data
  const [orders, setOrders] = useState([]); // Store user orders
  const [error, setError] = useState(null); // Store error message
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const getDetails = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axios.get(`/api/auth/getProfile/${userId}`);
        setProfile(profileResponse.data.user);

        // Fetch orders data
        const ordersResponse = await axios.get(`/api/auth/getProfileOrders/${userId}`);
        setOrders(ordersResponse.data.orders);
        
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      }
    };

    if (id) {
      getDetails();
    }
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl text-red-600 mb-4">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Welcome to E-commerce
        </h1>
        {message && (
          <div className="text-center text-lg text-gray-500 mb-4">{message}</div>
        )}

        {role && (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">Hello, {name}!</p>
            <p className="text-lg text-gray-700">
              You are logged in as{" "}
              <span className={`font-semibold ${role === "admin" ? "text-green-500" : "text-orange-500"}`}>
                {role === "admin" ? "Admin" : "Guest"}
              </span>.
            </p>
          </div>
        )}

        
      {role!=undefined && (
        <>
          <div className="bg-gray-50 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Profile</h2>
          {profile ? (
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {profile.name}</p>
              <p><span className="font-semibold">Email:</span> {profile.email}</p>
              <p><span className="font-semibold">Phone:</span> {profile.phoneNum}</p>
              <p><span className="font-semibold">Location:</span> {profile.location}</p>
              <p><span className="font-semibold">Role:</span> {profile.role}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
     
        {orders?.length > 0 ?
           (
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-gray-700">Product</th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700">Order ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) =>
                    order.items.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="px-4 py-2 text-gray-700">{item.Productname}</td>
                        <td className="px-4 py-2 text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-gray-700">{order._id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center mt-6 text-gray-600">{message}</p>
        )}</>
      )}
      </div>
    </div>
  );
}

export default Home;
