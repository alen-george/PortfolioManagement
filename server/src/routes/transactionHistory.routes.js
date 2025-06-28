const express = require("express");
const router  = express.Router();

router.get("/", async (req, res) => {
  // TODO: build query from filters and return history
  res.json({ message: "Transaction history placeholder" });
});

module.exports = router;
