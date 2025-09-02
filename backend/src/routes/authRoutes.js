// backend/src/routes/authRoutes.js
import { Router } from "express";
import passport from "passport";
import { forgotPassword, googleCallback, login, me, resetPassword, signup } from "../controllers/authController.js";
import { requireAuth } from "../utils/tokenUtils.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

export default router;
