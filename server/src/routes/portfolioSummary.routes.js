const express = require("express");

const { getPortfolioSummary }  = require("../Portfolio/models/portfolio");


const router  = express.Router();

router.get("/summary", getPortfolioSummary);

module.exports = router;
