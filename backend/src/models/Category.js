// backend/src/models/Account.js
import { db } from "../config/db.js";

export async function createAccount({ user_id, name, type, due_date = null, balance = 0 }) {
  const [r] = await db.execute(
    `INSERT INTO accounts (user_id, name, type, due_date, balance)
     VALUES (:user_id, :name, :type, :due_date, :balance)`,
    { user_id, name, type, due_date, balance }
  );
  return r.insertId;
}

export async function listAccounts(user_id) {
  const [rows] = await db.execute(`SELECT * FROM accounts WHERE user_id = :user_id`, { user_id });
  return rows;
}
