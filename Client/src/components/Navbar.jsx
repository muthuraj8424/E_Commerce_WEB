import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCartPlus,
  FaUser,
  FaShoppingBag,
  FaCogs,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import UserContext from "../context/UserContext";
import { FaSignInAlt } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaCaravan } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const { role } = useContext(UserContext);
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
       navigate("/login")
      window.location.reload()
      }
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaCogs /> },
    { name: "Add Product", path: "/admin/addProduct", icon: <FaShoppingBag /> },
    { name: "Manage Products", path: "/admin/manageProducts", icon: <MdOutlineProductionQuantityLimits /> },
    { name: "Manage Orders", path: "/admin/manageOrders", icon: <FaShoppingBag /> },
  ];

  const userLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Products", path: "/products", icon: <FaShoppingBag /> },
    { name: "Orders", path: "/user/orders", icon: <AiFillHeart /> },
    { name: "Cart", path: "/user/cart", icon: <FaCartPlus /> },
    // { name: "Profile", path: "/user/profile", icon: <FaUser /> },
    { name: "Support", path: "/user/support", icon: <MdOutlineSupportAgent /> },
    { name: "Track Order", path: "/user/trackOrder", icon: <FaCaravan /> },

  ];

  const guestLinks = [
    { name: "Login", path: "/login", icon: <FaSignInAlt /> },
    { name: "Register", path: "/register", icon: <FaUser /> },
    { name: "Admin", path: "/adminlogin", icon: <FaCogs /> },
  ];

  const linksToDisplay =
    role === "admin" ? adminLinks : role === "user" ? userLinks : guestLinks;

  return (
    <nav
      className={`bg-blue-600 text-white min-h-screen p-2 fixed top-0 left-0 z-50 transition-all duration-300 ${
        isSidebarOpen ? "w-48" : "w-8"
      }`}
    >
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={handleSidebarToggle}
          className="text-white mt-4 flex justify-center items-center w-full"
        >
          <FaBars className="text-lg" />
        </button>
        {linksToDisplay.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="flex items-center w-full justify-center text-center rounded hover:bg-blue-500 py-3"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="text-xl flex-shrink-0">{link.icon}</span>
            {isSidebarOpen && <span className="ml-2">{link.name}</span>}
          </Link>
        ))}
        {role && (
          <button
            onClick={handleLogout}
            className="flex items-center w-full justify-center text-center rounded bg-red-500 hover:bg-red-600 mt-auto py-3"
          >
            <FaSignOutAlt className="text-xl flex-shrink-0" />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
