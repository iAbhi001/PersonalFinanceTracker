// backend/src/initTables.js
import { db } from "./config/db.js";

async function createTables() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Accounts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type ENUM('credit','debit','checking','prepaid','cash') NOT NULL,
        balance DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    // Categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // Transactions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_id INT,
        category_id INT,
        amount DECIMAL(12,2) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
      );
    `);

    // Budgets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        period ENUM('monthly','weekly','yearly') DEFAULT 'monthly',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ All tables created successfully!");
    process.exit(0); // exit script
  } catch (err) {
    console.error("❌ Failed to create tables:", err.message);
    process.exit(1);
  }
}

createTables();
