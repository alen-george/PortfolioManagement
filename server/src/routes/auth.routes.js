const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  login,
  logout,
  logoutFromAllDevices,
  register,
} = require("../Auth/controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.post("/logout/all", authenticateToken, logoutFromAllDevices);

module.exports = router;
