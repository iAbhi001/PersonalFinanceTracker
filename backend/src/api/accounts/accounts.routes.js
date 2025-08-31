import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([{ id: 1, name: "Checking Account" }, { id: 2, name: "Credit Card" }]);
});

export default router;
