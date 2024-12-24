import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import UserContext from '../context/UserContext';

axios.defaults.withCredentials = true;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
//   const { setUser, setuseroradminrole } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("/api/auth/adminlogin", {
        email,
        password,
      });

      console.log(response.data);
    //   setUser(response.data.user); 
    //   setuseroradminrole(response.data.role); 

      alert(response.data.message);
      navigate("/admin/Dashboard");
      window.location.reload()
    } catch (err) {
      console.error("Error:", err.response);
    //   setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-6 fixed top-0 left-0 bg-gradient-to-r from-blue-100 to-blue-300 z-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 animate__animated animate__fadeIn">
          Admin Login
        </h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 focus:ring-4 focus:ring-blue-300"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

