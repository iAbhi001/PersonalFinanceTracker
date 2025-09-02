// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  setPasswordResetToken,
  consumePasswordResetToken,
  setPasswordHash,
} from "../models/User.js";

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await createUser({ name, email, passwordHash });

    const token = signToken({ id });
    res.status(201).json({ token, user: { id, name, email } });
  } catch (e) {
    console.error("Signup error:", e);  // 🔥 logs actual error
    res.status(500).json({ error: e.message || "Signup failed" });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user?.password) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.json({ ok: true }); // don't leak
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await setPasswordResetToken(user.id, token, expiresAt);
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to send reset email" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const userId = await consumePasswordResetToken(token);
    if (!userId) return res.status(400).json({ error: "Invalid or expired token" });
    const passwordHash = await bcrypt.hash(password, 10);
    await setPasswordHash(userId, passwordHash);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to reset password" });
  }
}

export async function googleCallback(req, res) {
  // Reached if passport success; attach JWT and redirect to app
  const token = signToken({ id: req.user.id });
  const redirect = `${process.env.WEB_URL}/oauth-success?token=${token}`;
  res.redirect(302, redirect);
}
