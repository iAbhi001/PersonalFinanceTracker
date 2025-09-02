// backend/src/models/Transaction.js
import { db } from "../config/db.js";

export async function createTransaction({ user_id, account_id, category_id = null, description, amount, date }) {
  const [r] = await db.execute(
    `INSERT INTO transactions (user_id, account_id, category_id, description, amount, date)
     VALUES (:user_id, :account_id, :category_id, :description, :amount, :date)`,
    { user_id, account_id, category_id, description, amount, date }
  );
  return r.insertId;
}

export async function getUserTransactions(user_id, { limit = 500, offset = 0, month = null } = {}) {
  let where = `WHERE t.user_id = :user_id`;
  const params = { user_id, limit, offset };
  if (month) {
    where += ` AND DATE_FORMAT(t.date, '%Y-%m') = :month`;
    params.month = month;
  }
  const [rows] = await db.execute(
    `SELECT t.*, a.name AS account_name, c.name AS category_name
     FROM transactions t
     LEFT JOIN accounts a ON a.id = t.account_id
     LEFT JOIN categories c ON c.id = t.category_id
     ${where}
     ORDER BY t.date DESC
     LIMIT :limit OFFSET :offset`,
    params
  );
  return rows;
}

export async function getCategorySummaryForMonth(user_id, month) {
  const [rows] = await db.execute(
    `SELECT COALESCE(c.name,'Uncategorized') AS category, ROUND(SUM(CASE WHEN t.amount < 0 THEN -t.amount ELSE t.amount END),2) AS value
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = :user_id AND DATE_FORMAT(t.date,'%Y-%m') = :month
     GROUP BY c.name
     ORDER BY value DESC`,
    { user_id, month }
  );
  return rows;
}

export async function getOutstandingByAccount(user_id) {
  // "Outstanding" for credit can be sum of negative amounts (spend) minus payments.
  const [rows] = await db.execute(
    `SELECT a.id, a.name, a.type,
            ROUND(SUM(t.amount),2) AS balance,
            CASE WHEN a.type = 'credit' THEN ROUND(-SUM(t.amount),2) ELSE ROUND(SUM(t.amount),2) END AS outstanding
     FROM accounts a
     LEFT JOIN transactions t ON t.account_id = a.id AND t.user_id = a.user_id
     WHERE a.user_id = :user_id
     GROUP BY a.id, a.name, a.type`,
    { user_id }
  );
  return rows;
}
