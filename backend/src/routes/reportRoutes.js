// backend/src/routes/reportRoutes.js
import { Router } from "express";
import { monthlyReport } from "../controllers/reportController.js";
import { requireAuth } from "../utils/tokenUtils.js";

const router = Router();
router.get("/monthly", requireAuth, monthlyReport);

export default router;
