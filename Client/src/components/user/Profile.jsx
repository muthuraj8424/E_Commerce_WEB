import React, { useState, useEffect, useContext } from "react";
import UserContext from '../../context/UserContext';
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Store profile data
  const [orders, setOrders] = useState([]); // Store user orders
  const [error, setError] = useState(null); // Store error message
  const { id } = useContext(UserContext);
  const [message, setMessage] = useState(null);
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
        if (ordersResponse.data.message) {
          setMessage(ordersResponse.data.message);
        }
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
      <div className="container max-w-screen-lg mx-auto p-6 bg-white rounded-lg shadow-lg m-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Error</h1>
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto p-6 bg-white rounded-lg shadow-lg ml-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 ml-4" >Your Profile</h1>
      {profile ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold">Name: </span>{profile.name}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            <span className="font-semibold">Email: </span>{profile.email}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            <span className="font-semibold">Phone Number: </span>{profile.phoneNum}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            <span className="font-semibold">Location: </span>{profile.location}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            <span className="font-semibold">Role: </span>{profile.role}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            <span className="font-semibold">Joined At: </span>{new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="text-lg font-medium text-gray-700">Loading profile...</p>
      )}

      {orders?.length > 0 ? (
        <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
          <ul className="list-disc pl-6">
            {orders.map((order, orderIndex) => (
              order.items.map((item, itemIndex) => (
                <li key={`${orderIndex}-${itemIndex}`} className="text-gray-700">
                  {item.Productname} - {new Date(order.orderDate).toLocaleDateString()}
                </li>
              ))
            ))}
          </ul>
        </div>
      ) : profile && (
        <p className="text-lg font-medium text-gray-700 mt-6">{message}.</p>
      )}
    </div>
  );
};

export default Profile;
