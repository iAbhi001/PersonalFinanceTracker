// backend/src/models/Budget.js
import { db } from "../config/db.js";

export async function upsertBudget({ user_id, category_id, limit_amount }) {
  const [exists] = await db.execute(
    `SELECT id FROM budgets WHERE user_id = :user_id AND category_id = :category_id`,
    { user_id, category_id }
  );
  if (exists[0]) {
    await db.execute(
      `UPDATE budgets SET limit_amount = :limit_amount WHERE id = :id`,
      { limit_amount, id: exists[0].id }
    );
    return exists[0].id;
  }
  const [r] = await db.execute(
    `INSERT INTO budgets (user_id, category_id, limit_amount) VALUES (:user_id, :category_id, :limit_amount)`,
    { user_id, category_id, limit_amount }
  );
  return r.insertId;
}

export async function getBudgetsForUser(user_id) {
  const [rows] = await db.execute(
    `SELECT b.id, b.category_id, c.name AS category, b.limit_amount
     FROM budgets b
     JOIN categories c ON c.id = b.category_id
     WHERE b.user_id = :user_id
     ORDER BY c.name`,
    { user_id }
  );
  return rows;
}

export async function deleteBudget(user_id, id) {
  await db.execute(`DELETE FROM budgets WHERE id = :id AND user_id = :user_id`, { id, user_id });
}
