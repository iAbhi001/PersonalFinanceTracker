import express from "express";
import cors from "cors";
import authRoutes from "../api/auth/auth.routes.js";
import transactionRoutes from "../api/transactions/transactions.routes.js";
import aiRoutes from "../api/ai/ai.routes.js";
import accountRoutes from "../api/accounts/accounts.routes.js";
import errorHandler from "../middleware/errorHandler.js";
import budgetRoutes from "../api/budget/budget.routes.js";


export default (app) => {
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/accounts", accountRoutes);
  app.use("/api/budgets", budgetRoutes);
  // Error Handler
  app.use(errorHandler);
};
