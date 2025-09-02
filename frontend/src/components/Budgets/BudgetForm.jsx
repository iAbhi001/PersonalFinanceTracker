// src/components/Budgets/BudgetForm.js
import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { setBudget } from "../../api/budgetApi.js";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function BudgetForm({ onSaved }) {
  const { token } = useContext(AuthContext);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await setBudget(token, { category_id: categoryId, limit_amount: Number(limit) });
      setCategoryId("");
      setLimit("");
      if (onSaved) onSaved();
    } catch {
      alert("Failed to save budget");
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
      <Typography variant="subtitle1">Set Budget</Typography>
      <TextField label="Category ID or Name" fullWidth margin="dense" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
      <TextField label="Monthly Limit ($)" type="number" fullWidth margin="dense" value={limit} onChange={(e) => setLimit(e.target.value)} />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Save Budget
      </Button>
    </Box>
  );
}
