import pool from "../../config/database.js";

export const findAll = async () => {
  const result = await pool.query("SELECT * FROM budgets ORDER BY category");
  return result.rows;
};

export const create = async ({ category, amount, month }) => {
  const result = await pool.query(
    "INSERT INTO budgets (category, amount, month) VALUES ($1,$2,$3) RETURNING *",
    [category, amount, month]
  );
  return result.rows[0];
};

export const usage = async () => {
  const result = await pool.query(`
    SELECT b.category, b.amount AS budget_amount,
           COALESCE(SUM(t.amount),0) AS spent
    FROM budgets b
    LEFT JOIN transactions t 
      ON b.category = t.category AND DATE_TRUNC('month', t.date) = b.month
    GROUP BY b.category, b.amount
    ORDER BY b.category
  `);
  return result.rows;
};
