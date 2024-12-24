import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const userData = response.data;
      console.log(userData.role);
      alert(userData.message)
      navigate("/products");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-6 fixed top-0 left-0 bg-gradient-to-r from-purple-100 to-purple-300 z-10">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;