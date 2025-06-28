require("dotenv").config();

const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const winston = require("winston");
require("./db");

const app  = express();
const port = process.env.PORT || 5000;

// ── middleware ──────────────────────
app.use(express.json());
app.use(helmet());
app.use(cors());

// ── logger ──────────────────────────
const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
});

// ── feature routes ──────────────────
const portfolioRoutes   = require("./routes/portfolioSummary.routes");
const orderRoutes       = require("./routes/orderEntry.routes");
const transactionRoutes = require("./routes/transactionHistory.routes");

// basic health-check (for k8s / LB)
app.get("/health", (_, res) => res.json({ status: "UP" }));

// mount domain modules
app.use("/api/portfolio",    portfolioRoutes);
app.use("/api/order",        orderRoutes);
app.use("/api/transactions", transactionRoutes);

// ── start server ────────────────────
app.listen(port, () => logger.info(`API listening on :${port}`));

module.exports = app;  // for tests
