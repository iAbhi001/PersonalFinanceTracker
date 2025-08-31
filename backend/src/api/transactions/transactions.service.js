import * as TransactionModel from "./transactions.model.js";

export const getTransactions = async () => TransactionModel.findAll();
export const saveTransactions = async (transactions) => TransactionModel.bulkInsert(transactions);
