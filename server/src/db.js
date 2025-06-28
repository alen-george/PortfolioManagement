require("dotenv").config();
const { Pool } = require("pg");

/**
 * One singleton Pool for the whole back-end.
 *   import pool from "../db";
 *   const { rows } = await pool.query("SELECT …");
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = pool;
