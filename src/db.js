const mysql = require("mysql2/promise");

function getDbConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "auth_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig());
  }
  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

module.exports = {
  query,
  getPool,
};

