// backend/src/utils/sesUtils.js
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const ses = new AWS.SES({ region: process.env.AWS_REGION || "us-east-1" });

export async function sendSesEmail({ to, subject, html, text }) {
  const Source = process.env.MAIL_FROM || "no-reply@yourdomain.com";
  const params = {
    Source,
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: html ? { Data: html } : undefined,
        Text: text ? { Data: text } : undefined,
      },
    },
  };
  return ses.sendEmail(params).promise();
}
