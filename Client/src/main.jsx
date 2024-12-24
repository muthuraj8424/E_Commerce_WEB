import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import axios from "axios";
const root = ReactDOM.createRoot(document.getElementById("root"));
axios.defaults.withCredentials = true;

root.render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);
