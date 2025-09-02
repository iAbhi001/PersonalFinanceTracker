// backend/src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Ensure the database exists
async function ensureDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT || 3306,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database ${process.env.DB_NAME} ensured`);
    await connection.end();
  } catch (err) {
    console.error("❌ Failed to ensure DB:", err.message);
    process.exit(1); // stop app if DB can't be created
  }
}

// Step 2: Create the pool after DB exists
await ensureDatabase();

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});
