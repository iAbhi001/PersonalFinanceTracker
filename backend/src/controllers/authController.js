// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  setPasswordResetToken,
  consumePasswordResetToken,
  setPasswordHash,
} from "../models/User.js";

// Helper to sign JWT tokens
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// -------------------
// User Signup
// -------------------
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await createUser({ name, email, passwordHash });

    const token = signToken({ id });

    await sendEmail({
      to: email,
      subject: "Welcome to Personal Finance Tracker",
      html: `<h1>Hello ${name}</h1><p>Thanks for signing up!</p>`,
    });

    res.status(201).json({ token, user: { id, name, email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "Signup failed" });
  }
}

// -------------------
// User Login
// -------------------
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await findUserByEmail(email);
    if (!user?.password) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}

// -------------------
// Get logged-in user
// -------------------
export async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// -------------------
// Forgot Password
// -------------------
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await findUserByEmail(email);
    if (!user) return res.json({ ok: true }); // avoid leaking email existence

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await setPasswordResetToken(user.id, token, expiresAt);

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>`,
      text: `Click the link to reset your password: ${resetUrl}`,
    });

    console.log(`Password reset token for ${email}:`, token);
    res.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
}

// -------------------
// Reset Password
// -------------------
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    console.log("Reset password request received");
    console.log("Token:", token);
    console.log("Password received:", password ? "********" : "empty");

    if (!token || !password) {
      console.log("Missing token or password");
      return res.status(400).json({ error: "Missing token or password" });
    }

    const userId = await consumePasswordResetToken(token);
    if (!userId) {
      console.log("Invalid or expired token");
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    console.log("Token valid for user ID:", userId);

    const passwordHash = await bcrypt.hash(password, 10);
    await setPasswordHash(userId, passwordHash);

    console.log("Password updated successfully for user ID:", userId);
    res.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}

// -------------------
// Google OAuth Callback
// -------------------
export async function googleCallback(req, res) {
  try {
    const token = signToken({ id: req.user.id });
    const redirect = `${process.env.WEB_URL}/oauth-success?token=${token}`;
    res.redirect(302, redirect);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ error: "OAuth login failed" });
  }
}
