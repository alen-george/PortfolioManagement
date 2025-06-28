const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
  getLoginAudit,
} = require("../Auth/controllers/userController");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.get("/audits", authenticateToken, getLoginAudit);

module.exports = router;
