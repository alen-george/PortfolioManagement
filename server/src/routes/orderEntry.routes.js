const express = require("express");
const router  = express.Router();

router.post("/", async (req, res) => {
  // TODO: validate, check balance, book legacy trade
  res.status(201).json({ message: "Order booked (placeholder)" });
});

module.exports = router;
