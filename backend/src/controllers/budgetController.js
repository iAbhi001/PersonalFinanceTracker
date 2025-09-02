// backend/src/controllers/budgetController.js
import { upsertBudget, getBudgetsForUser, deleteBudget } from "../models/Budget.js";

export async function setBudget(req, res) {
  try {
    const userId = req.user.id;
    const { category_id, limit_amount } = req.body;
    const id = await upsertBudget({ user_id: userId, category_id, limit_amount });
    res.status(201).json({ id });
  } catch {
    res.status(500).json({ error: "Failed to set budget" });
  }
}

export async function listBudgets(req, res) {
  try {
    const rows = await getBudgetsForUser(req.user.id);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
}

export async function removeBudget(req, res) {
  try {
    await deleteBudget(req.user.id, Number(req.params.id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete budget" });
  }
}
