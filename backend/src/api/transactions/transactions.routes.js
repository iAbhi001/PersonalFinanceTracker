import { Router } from "express";
import { getTransactions } from "./transactions.controller.js";

const router = Router();
router.get("/", getTransactions);

export default router;
