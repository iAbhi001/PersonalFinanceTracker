// backend/src/routes/transactionRoutes.js
import { Router } from "express";
import multer from "multer";
import { addTransaction, categoryPieThisMonth, listTransactions, outstanding, uploadStatement } from "../controllers/transactionController.js";
import { requireAuth } from "../utils/tokenUtils.js";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.use(requireAuth);
router.post("/", addTransaction);
router.get("/", listTransactions);
router.get("/summary/category", categoryPieThisMonth);
router.get("/outstanding", outstanding);
router.post("/upload-statement", upload.single("file"), uploadStatement);

export default router;
