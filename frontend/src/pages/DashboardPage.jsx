// src/pages/DashboardPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext.jsx";
import { getCategorySummary, getOutstanding, listTransactions, listAccounts, listCategories } from "../api/transactionApi.js";
import AddTransactionForm from "../components/Transactions/AddTransactionForm.jsx";
import TransactionList from "../components/Transactions/TransactionList.jsx";
import SpendingPieChart from "../components/Charts/PieChart.jsx";

export default function DashboardPage() {
  const { token } = useContext(AuthContext);

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [outstanding, setOutstanding] = useState({ accounts: [], total: 0 });

  // Load all dashboard data
  const loadDashboard = async () => {
    if (!token) return;
    try {
      const [acc, cat, txns, chart, out] = await Promise.all([
        listAccounts(token),
        listCategories(token),
        listTransactions(token),
        getCategorySummary(token),
        getOutstanding(token),
      ]);
      setAccounts(acc);
      setCategories(cat);
      setTransactions(txns);
      setChartData(chart);
      setOutstanding(out);
    } catch (e) {
      console.error("Error loading dashboard:", e);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {/* Left column: Outstanding + AddTransaction */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Outstanding Balance</Typography>
            <Typography variant="h4">${Number(outstanding.total || 0).toFixed(2)}</Typography>
            <Box mt={2}>
              {outstanding.accounts.map((a) => (
                <Typography key={a.id} variant="body2">
                  {a.name} — ${Number(a.outstanding || 0).toFixed(2)}
                </Typography>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <AddTransactionForm
              accounts={accounts}
              categories={categories}
              onAdded={loadDashboard}
            />
          </Paper>
        </Grid>

        {/* Right column: Pie Chart + Transactions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>
              Spending by Category
            </Typography>
            <SpendingPieChart data={chartData} />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Recent Transactions
            </Typography>
            <TransactionList transactions={transactions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
