// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

const app = express();

app.use(cors({ origin: process.env.WEB_URL?.split(",") || true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reports", reportRoutes);
app.use("/budgets", budgetRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

export default app;
