import * as TransactionService from "./transactions.service.js";

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await TransactionService.getTransactions();
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
