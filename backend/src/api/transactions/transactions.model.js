import pool from "../../config/database.js";

export const findAll = async () => {
  const result = await pool.query("SELECT * FROM transactions ORDER BY date DESC");
  return result.rows;
};

export const create = async ({ date, description, amount, category }) => {
  const result = await pool.query(
    "INSERT INTO transactions (date, description, amount, category) VALUES ($1,$2,$3,$4) RETURNING *",
    [date, description, amount, category || "Uncategorized"]
  );
  return result.rows[0];
};

export const bulkInsert = async (transactions) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let tx of transactions) {
      await client.query(
        "INSERT INTO transactions (date, description, amount, category) VALUES ($1,$2,$3,$4)",
        [tx.date, tx.description, tx.amount, tx.category || "Uncategorized"]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
