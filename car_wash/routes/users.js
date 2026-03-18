var express = require("express");
var router = express.Router();
const {
  authUser,
  registerUser,
  setupAdmin,
  getUserProfile,
} = require("../Controller/userController");
const { protect } = require("../Middleware/authMiddleware");

// Authentication routes
router.post("/login", authUser);
router.post("/register", registerUser);

// Setup initial admin route (hit this once to create the first admin)
router.post("/setup-admin", setupAdmin);

// Profile route (requires JWT token)
router.get("/profile", protect, getUserProfile);

module.exports = router;
