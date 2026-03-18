const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check for user name instead of email, since user request specifically said "username : Admin"
    // Though the model has name and email fields, we map username to name for simplicity,
    // or we could check both email and name. Let's use name.
    const user = await User.findOne({ where: { name } });

    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new admin user
// @route   POST /api/users/setup-admin
// @access  Public (for initial setup only)
const setupAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ where: { role: "admin" } });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@carwash.com", // Since email is required in DB schema
      password: "@admin",
      role: "admin",
    });

    if (adminUser) {
      res.status(201).json({
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user", // Default role
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  authUser,
  setupAdmin,
  registerUser,
  getUserProfile,
};
