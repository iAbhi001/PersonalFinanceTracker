import React, { useContext, useState } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { addTransaction, listAccounts, addAccount } from "../../api/transactionApi.js";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function AddTransactionForm({ accounts: initialAccounts = [], categories, onAdded }) {
  const { token } = useContext(AuthContext);

  const [accounts, setAccounts] = useState(initialAccounts);
  const [newAccountName, setNewAccountName] = useState("");
  const [form, setForm] = useState({
    account_id: "",
    category_id: "",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Handle form input changes
  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // Submit new transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(token, { ...form, amount: Number(form.amount) });
      setForm({ account_id: "", category_id: "", description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Failed to add transaction. Check console for details.");
    }
  };

  // Add a new account
  const handleAddAccount = async () => {
    if (!newAccountName.trim()) return;
    try {
      const res = await addAccount(token, { name: newAccountName });
      setAccounts([...accounts, res]);
      setForm((s) => ({ ...s, account_id: res.id }));
      setNewAccountName("");
    } catch (err) {
      console.error("Error adding account:", err);
      alert("Failed to add account");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">Add Transaction</Typography>

      {/* Account selection */}
      <TextField
        select
        label="Account"
        name="account_id"
        value={form.account_id}
        onChange={handleChange}
        required
        helperText="Select an account or create a new one below"
      >
        {accounts.map((a) => (
          <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
        ))}
      </TextField>

      {/* Add new account */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="New Account"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
        />
        <Button variant="outlined" onClick={handleAddAccount}>Add</Button>
      </Box>

      {/* Category selection */}
      <TextField
        select
        label="Category"
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        required
      >
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>

      <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
      <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <Button type="submit" variant="contained" onClick={handleSubmit}>Add Transaction</Button>
    </Box>
  );
}
