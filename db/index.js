const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString });

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = { query }