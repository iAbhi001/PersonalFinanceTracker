// backend/src/models/User.js
import { db } from "../config/db.js";

export async function createUser({ name, email, passwordHash, googleId = null }) {
  const [r] = await db.execute(
    `INSERT INTO users (name, email, password, google_id) VALUES (:name, :email, :password, :google_id)`,
    { name, email: email?.toLowerCase() || null, password: passwordHash, google_id: googleId }
  );
  return r.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = :email`, { email: email?.toLowerCase() });
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = :id`, { id });
  return rows[0];
}

export async function findUserByGoogleId(googleId) {
  const [rows] = await db.execute(`SELECT * FROM users WHERE google_id = :google_id`, { google_id: googleId });
  return rows[0];
}

export async function linkGoogleAccount(userId, googleId) {
  await db.execute(`UPDATE users SET google_id = :google_id WHERE id = :id`, { google_id: googleId, id: userId });
}

export async function setPasswordResetToken(userId, token, expiresAt) {
  await db.execute(
    `UPDATE users SET reset_token = :token, reset_expires = :expires WHERE id = :id`,
    { token, expires: expiresAt, id: userId }
  );
}

export async function consumePasswordResetToken(token) {
  const [rows] = await db.execute(
    `SELECT id, reset_expires FROM users WHERE reset_token = :token`,
    { token }
  );
  const u = rows[0];
  if (!u) return null;
  if (new Date(u.reset_expires) < new Date()) return null;
  await db.execute(`UPDATE users SET reset_token = NULL, reset_expires = NULL WHERE id = :id`, { id: u.id });
  return u.id;
}

export async function setPasswordHash(userId, hash) {
  await db.execute(`UPDATE users SET password = :hash WHERE id = :id`, { hash, id: userId });
}
