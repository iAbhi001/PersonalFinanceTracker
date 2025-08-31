import { Router } from "express";
import multer from "multer";
import { handleFileUpload } from "./ai.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("statement"), handleFileUpload);

export default router;
