import fs from "fs";

export const parseStatement = async (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").slice(1);
  return lines
    .map((line) => {
      const [date, description, amount] = line.split(",");
      return { date, description, amount: parseFloat(amount), category: "Uncategorized" };
    })
    .filter((t) => t.date);
};
