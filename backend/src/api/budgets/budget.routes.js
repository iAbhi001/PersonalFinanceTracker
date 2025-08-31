import { Router } from "express";
import { getBudgets, addBudget, getBudgetUsage } from "./budget.controller.js";

const router = Router();
router.get("/", getBudgets);
router.post("/", addBudget);
router.get("/usage", getBudgetUsage);

export default router;
