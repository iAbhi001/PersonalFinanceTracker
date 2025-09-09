// backend/src/routes/accountRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { addAccount, listAccounts } from "../controllers/accountController.js";

const router = express.Router();

router.use(authMiddleware); // protect all routes

router.get("/", listAccounts);
router.post("/", addAccount);

export default router;
