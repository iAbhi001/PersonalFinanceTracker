// backend/src/config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Option A: SES SMTP (recommended in many stacks)
// Provide: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (from SES)
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // email-smtp.us-east-1.amazonaws.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || "no-reply@yourdomain.com";
  return transport.sendMail({ from, to, subject, text, html });
}
