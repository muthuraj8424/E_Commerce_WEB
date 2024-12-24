const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const router = express.Router();
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "muthurajfrnd089346@gmail.com", // Your email address
    pass: "jxrd edug xoue meux", // Your email password or app-specific password
  },
});
// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;
    console.log(req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNum:phone,
      location,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("passmatch " + isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log("login-token " + token);

    // Send cookie and response
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    }).status(200).json({
      message: "Login successful",
      user: user.email,
      role: user.role,
      id: user.id,
      token,
      success:true
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  console.log("token " + token);
  
  if (!token) 
    return res.json({ message: "Signup or Login to View or Add Products " }); // Return to avoid further execution

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("get profile " + decoded.id);

    // If token verification fails
    if (!decoded) 
      return res.status(404).json({ message: "User not found" }); // Return to avoid further execution

    // Send user info if verification succeeds
    res.json({ user: decoded.email, role: decoded.role, id: decoded.id });
  } catch (error) {
    console.error("Error verifying token:", error);

    // Handle token verification errors
    res.status(401).json({ message: "Invalid or expired token" });
  }
});
router.get('/getProfile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({user});
  } catch (error) {
    console.error('Error fetching user or orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/getProfileOrders/:id', async (req, res) => {
  const { id } = req.params; 
  console.log(id);
  // Extract user ID from request params
  try {
    // Fetch orders where the user field matches the provided ID
    const orders = await Order.find({ user: id });

    // Check if any orders exist
    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: 'No orders found for this user.' });
    }

    // Send the orders data as a response
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { 
    expires: new Date(0), 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', // Only secure cookies in production
    sameSite: 'Strict' // Adjust based on your requirements
  });

  // Send response to the client
  res.status(200).json({ message: "Logged out successfully" });
});
// admin login
router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const role = "admin";
  try {
    // Check if email matches the hardcoded admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches the hardcoded admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration (1 hour)
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only over HTTPS
        sameSite: "none", // Allow cross-origin
        maxAge: 3600000, 
      })
      .json({
        user: email,
        role: role,
        success: true,
        message:"Admin login Successfull"
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/support", async (req, res) => {
  try {
    const {email, message } = req.body;

    // Set up the mail options
    const mailOptions = {
      from: email, // sender address
      to: "muthurajfrnd089346@gmail.com", // replace with your receiver email
      subject: `Support Request from: ${email}`, // subject
      text: `Message : ${message}`, // text body
    };

    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return res.json({
      success: true,
      message: "Enquiry submitted and email sent successfully",
    });
  } catch (error) {
    console.error("Error in sending enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send enquiry",
      error: error.message,
    });
  }
});

module.exports = router;
