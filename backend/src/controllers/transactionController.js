// backend/src/controllers/transactionController.js
import {
  createTransaction,
  getUserTransactions,
  getCategorySummaryForMonth,
  getOutstandingByAccount,
} from "../models/Transaction.js";
import { parseCardStatement } from "../utils/pdfParser.js";

export async function addTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { account_id, category_id, description, amount, date } = req.body;
    const id = await createTransaction({ user_id: userId, account_id, category_id, description, amount, date });
    res.status(201).json({ id });
  } catch (e) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
}

export async function listTransactions(req, res) {
  try {
    const userId = req.user.id;
    const rows = await getUserTransactions(userId, { limit: 500, offset: 0 });
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

export async function uploadStatement(req, res) {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const txns = await parseCardStatement(file.path); // [{date, description, amount, account_id, category_id?}]
    for (const t of txns) {
      await createTransaction({ user_id: userId, ...t });
    }
    res.json({ inserted: txns.length });
  } catch (e) {
    res.status(500).json({ error: "Failed to parse statement" });
  }
}

export async function categoryPieThisMonth(req, res) {
  try {
    const userId = req.user.id;
    const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
    const data = await getCategorySummaryForMonth(userId, month);
    res.json(data); // [{ category: 'Food', value: 123.45 }]
  } catch {
    res.status(500).json({ error: "Failed to summarize categories" });
  }
}

export async function outstanding(req, res) {
  try {
    const userId = req.user.id;
    const rows = await getOutstandingByAccount(userId);
    const total = rows.reduce((s, r) => s + Number(r.outstanding || 0), 0);
    res.json({ accounts: rows, total });
  } catch {
    res.status(500).json({ error: "Failed to compute outstanding" });
  }
}
