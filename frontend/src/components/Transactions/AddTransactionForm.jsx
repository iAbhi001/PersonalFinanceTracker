// src/components/Transactions/AddTransactionForm.js
import React, { useContext, useState } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { addTransaction } from "../../api/transactionApi.js";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function AddTransactionForm({ onAdded }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    account_id: "",
    category_id: "",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addTransaction(token, { ...form, amount: Number(form.amount) });
      setForm({ account_id: "", category_id: "", description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
      if (onAdded) onAdded();
    } catch (err) {
      alert("Failed to add transaction");
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
      <Typography variant="subtitle1" mb={1}>
        Add Transaction
      </Typography>

      {/* For simplicity these are free text; ideally populate accounts/categories from API */}
      <TextField label="Account (id or name)" name="account_id" fullWidth margin="dense" value={form.account_id} onChange={handleChange} />
      <TextField label="Category (id or name)" name="category_id" fullWidth margin="dense" value={form.category_id} onChange={handleChange} />
      <TextField label="Description" name="description" fullWidth margin="dense" value={form.description} onChange={handleChange} />
      <TextField label="Amount" name="amount" type="number" fullWidth margin="dense" value={form.amount} onChange={handleChange} />
      <TextField label="Date" name="date" type="date" fullWidth margin="dense" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />

      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Add
      </Button>
    </Box>
  );
}
