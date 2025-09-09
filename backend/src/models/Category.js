// backend/src/models/Category.js
import { db } from "../config/db.js";

// Create a new category
export async function createCategory({ user_id, name }) {
  const [result] = await db.query(
    "INSERT INTO categories (user_id, name) VALUES (?, ?)",
    [user_id, name]
  );
  return { id: result.insertId, name };
}

// List categories for a user
export async function listCategories(user_id) {
  const [rows] = await db.query(
    "SELECT id, name FROM categories WHERE user_id = ?",
    [user_id]
  );
  return rows;
}
