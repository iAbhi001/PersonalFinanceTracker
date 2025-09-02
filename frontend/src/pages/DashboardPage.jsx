// src/pages/DashboardPage.js
import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Box, Button } from "@mui/material";
import SpendingPieChart from "../components/Charts/PieChart.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { getCategorySummary, getOutstanding } from "../api/transactionApi.js";
import AddTransactionForm from "../components/Transactions/AddTransactionForm.jsx";
import TransactionList from "../components/Transactions/TransactionList.jsx";

export default function DashboardPage() {
  const { token } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);
  const [outstanding, setOutstanding] = useState({ accounts: [], total: 0 });

  async function load() {
    try {
      const [chart, out] = await Promise.all([getCategorySummary(token), getOutstanding(token)]);
      setChartData(chart);
      setOutstanding(out);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Outstanding Balance</Typography>
            <Typography variant="h4">${Number(outstanding.total || 0).toFixed(2)}</Typography>
            <Box mt={2}>
              {outstanding.accounts.map((a) => (
                <Box key={a.id} sx={{ mb: 1 }}>
                  <Typography variant="body2">{a.name} — ${Number(a.outstanding || 0).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Box mt={2}>
            <AddTransactionForm onAdded={load} />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <SpendingPieChart data={chartData} />
            <Box mt={2}>
              <TransactionList />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
