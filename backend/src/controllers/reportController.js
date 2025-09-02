// backend/src/controllers/reportController.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCategorySummaryForMonth, getUserTransactions } from "../models/Transaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function monthlyReport(req, res) {
  try {
    const userId = req.user.id;
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const categories = await getCategorySummaryForMonth(userId, month);
    const txns = await getUserTransactions(userId, { month });

    const fileName = `report-${userId}-${month}.pdf`;
    const outDir = path.join(__dirname, "../../tmp");
    fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, fileName);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text(`Monthly Report - ${month}`, { underline: true });
    doc.moveDown();

    doc.fontSize(14).text("Category Summary:");
    categories.forEach((c) => doc.text(`${c.category}: $${Number(c.value).toFixed(2)}`));
    doc.moveDown();

    doc.fontSize(14).text("Transactions:");
    txns.forEach((t) =>
      doc.text(`${t.date} | ${t.account_name || ""} | ${t.description} | $${Number(t.amount).toFixed(2)} (${t.category_name || "Uncategorized"})`)
    );

    doc.end();
    doc.on("finish", () => {
      res.download(filePath, fileName, (err) => {
        if (!err) fs.unlink(filePath, () => {});
      });
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate report" });
  }
}
