import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import AdminOrders from "./components/admin/AdminOrders";
import UserOrders from "./components/user/UserOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import AdminLogin from "./pages/AdminLogin";
// admin impports
import AdminDashBoard from "./components/admin/AdminDashboard";
// import AdminProductsPage from "./components/admin/AdminProductsPage";
import ManageProducts from "./components/admin/ManageProducts";
import ManageOrders from "./components/admin/ManageOrders";
// import ManageUsers from "./components/admin/ManageUsers";
import "./App.css"
import AddProducts from "./components/admin/AddProducts";
import Home from "./pages/Home";
import DisplayComponents from "./pages/DisplayComponents"
import DeatiledInfo from "./pages/DeatiledInfo";
import Cart from "./components/user/Cart";
import PlaceOrder from "./components/user/PlaceOrder";
import Profile from "./components/user/Profile";
import TrackOrder from "./components/user/TrackOrder";
import Support from "./components/user/Support";
axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.withCredentials = true
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<DisplayComponents />} />
          <Route path="/product/:id" element={<DeatiledInfo />} />
          
        {/* Admin Routes */}
          <Route path="/admin/addProduct" element={<AddProducts />} />
          <Route path="/admin/Dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/manageOrders" element={<ManageOrders />} />
          <Route path="/admin/manageProducts" element={<ManageProducts />} />
          {/* <Route path="/admin/manageUsers" element={<ManageUsers />} /> */}
          
          {/* User Routes */}
          <Route path="/user/orders" element={<UserOrders />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/user/trackOrder" element={<TrackOrder />} />
          <Route path="/user/checkout" element={<PlaceOrder />}  />
          {/* <Route path="/user/profile" element={<Profile />}  /> */}
          <Route path="/user/support" element={<Support />}  />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
