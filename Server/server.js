// const express = require("express");
// const connectDB = require("./config/db");
// // const eventDb = require('./config/Event');
// const cors = require("cors");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");


// dotenv.config();

// // Create Express server
// const app = express();
// app.use(cookieParser())
// // Connect to the database
// connectDB();
// // eventDb()
// // Middleware
// app.use(express.json()); // For parsing JSON requests
// const corsOptions = {
//   origin: ['http://localhost:5173'], 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
//   credentials: true, 
//   preflightContinue: false, 
//   allowedHeaders: ['Content-Type', 'Authorization'] 
// };


// app.use(cors(corsOptions));

// app.options('*', cors(corsOptions)); 

// app.use(cookieParser());

// // Routes
// app.use("/api/auth", authRoutes); // Authentication routes (Login/Signup)

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const adminRoutes = require("./routes/admin")
dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true, 
  preflightContinue: false, 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};
app.use(cookieParser())
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth",authRoutes );
app.use("/api/products", productRoutes);
app.use("/api/orders",orderRoutes );
app.use("/api/admin",adminRoutes)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

