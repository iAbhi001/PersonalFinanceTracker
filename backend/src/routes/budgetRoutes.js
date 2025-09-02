// backend/src/routes/budgetRoutes.js
import { Router } from "express";
import { listBudgets, removeBudget, setBudget } from "../controllers/budgetController.js";
import { requireAuth } from "../utils/tokenUtils.js";

const router = Router();
router.use(requireAuth);

router.get("/", listBudgets);
router.post("/", setBudget);
router.delete("/:id", removeBudget);

export default router;
