// src/pages/BudgetPage.js
import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import BudgetForm from "../components/Budgets/BudgetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { getBudgets, deleteBudget } from "../api/budgetApi.js";

export default function BudgetPage() {
  const { token } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);

  async function load() {
    try {
      const rows = await getBudgets(token);
      setBudgets(rows);
    } catch {
      console.error("Failed to load budgets");
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function handleDelete(id) {
    if (!confirm("Delete this budget?")) return;
    try {
      await deleteBudget(token, id);
      load();
    } catch {
      alert("Failed to delete budget");
    }
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <BudgetForm onSaved={load} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Your Budgets</Typography>
            <Box mt={1}>
              {budgets.length === 0 && <Typography>No budgets set</Typography>}
              {budgets.map((b) => (
                <Box key={b.id} sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: "1px solid #eee" }}>
                  <Box>
                    <Typography>{b.category}</Typography>
                    <Typography variant="body2">${Number(b.limit_amount).toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleDelete(b.id)} size="small" color="error">
                      ×
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
