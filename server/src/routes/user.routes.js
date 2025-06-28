const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
} = require("../Auth/controllers/userController");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

module.exports = router;
