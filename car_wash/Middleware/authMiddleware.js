const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token and attach to req.user
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }
      });

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } 
  // Alternatively, check cookies if token is stored there
  else if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token and attach to req.user
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }
      });

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware - MUST be placed after `protect` middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
