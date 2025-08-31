import { parseStatement } from "./ai.service.js";
import * as TransactionService from "../transactions/transactions.service.js";

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const transactions = await parseStatement(req.file.path);
    await TransactionService.saveTransactions(transactions);
    res.json({ message: "Transactions uploaded", transactions });
  } catch (error) {
    next(error);
  }
};
