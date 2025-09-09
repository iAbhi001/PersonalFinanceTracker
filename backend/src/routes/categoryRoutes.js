import express from "express";
import { listCategories, addCategory } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listCategories);
router.post("/", addCategory);

export default router;
