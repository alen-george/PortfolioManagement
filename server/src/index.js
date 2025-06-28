require("dotenv").config();

const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const { Pool } = require("pg");
const winston = require("winston");

const app  = express();
const port = process.env.PORT || 5000;

// ── middleware ──────────────────────
app.use(express.json());
app.use(helmet());
app.use(cors());

// ── logger ──────────────────────────
const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()]
});

// ── pg pool ─────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// basic health-check (for k8s / LB)
app.get("/health", (_, res) => res.json({ status: "UP" }));

// TODO: add routes for Module-1/3/4 …

// ── start server ────────────────────
app.listen(port, () => logger.info(`API listening on :${port}`));

module.exports = app;   // for tests
