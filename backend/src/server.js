import express from "express";
import dotenv from "dotenv";
import loaders from "./loaders/index.js";

dotenv.config();

async function startServer() {
  const app = express();

  await loaders(app);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
