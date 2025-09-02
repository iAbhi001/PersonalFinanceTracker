// backend/src/utils/pdfParser.js
import fs from "fs";
import pdf from "pdf-parse";

/**
 * Very lightweight heuristic parser for Discover/Capital One statements.
 * Returns [{ date, description, amount, account_id?, category_id? }]
 * In real life you'll build per-statement templates.
 */
export async function parseCardStatement(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  const lines = data.text.split("\n").map((l) => l.trim()).filter(Boolean);

  const txns = [];
  const dateRegex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[01])\/\d{2,4}$/; // MM/DD/YY(YY)
  // Example line formats we try to catch:
  // 03/14/2025 STARBUCKS #123   -$5.67
  // 03/14/2025 AMAZON MARKETPLACE $25.30
  const lineRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+?)\s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)$/;

  for (const line of lines) {
    const m = lineRegex.exec(line);
    if (!m) continue;
    const [, dateStr, descRaw, amtRaw] = m;
    if (!dateRegex.test(dateStr)) continue;
    const amount = Number(amtRaw.replace(/\$|,/g, ""));
    const date = normalizeDate(dateStr);
    const description = descRaw.replace(/\s+/g, " ").slice(0, 255);
    // account_id/category_id can be matched by context; omitted here
    txns.push({ date, description, amount });
  }
  return txns;
}

function normalizeDate(mmddyy) {
  const [m, d, y] = mmddyy.split("/");
  const year = Number(y) < 100 ? 2000 + Number(y) : Number(y);
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
