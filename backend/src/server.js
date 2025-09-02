// backend/src/server.js
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { db } from "./config/db.js";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Try to get a connection from the pool
    const connection = await db.getConnection();
    console.log("✅ Connected to RDS successfully");
    connection.release(); // release back to the pool
  } catch (err) {
    console.error("❌ Failed to connect to RDS:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://0.0.0.0:${PORT}`);
  });
})();
