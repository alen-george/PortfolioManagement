const express = require("express");
const router  = express.Router();

router.get("/", async (req, res) => {
  // TODO: implement filters + data fetch
  res.json({ message: "Portfolio summary placeholder" });
});

module.exports = router;
