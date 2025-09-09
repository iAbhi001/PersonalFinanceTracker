// backend/src/controllers/accountController.js
import { createAccount, listAccounts as listAccountsModel } from "../models/Account.js";

export async function addAccount(req, res) {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Account name required" });
    const id = await createAccount({ user_id: userId, name });
    res.status(201).json({ id, name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create account" });
  }
}

export async function listAccounts(req, res) {
  try {
    const userId = req.user.id;
    const accounts = await listAccountsModel(userId);
    res.json(accounts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
}
