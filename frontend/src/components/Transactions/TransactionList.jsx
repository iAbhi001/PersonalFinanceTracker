// src/components/Transactions/TransactionList.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { listTransactions } from "../../api/transactionApi.js";
import { Box, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function TransactionList() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await listTransactions(token);
        if (mounted) setItems(rows);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (mounted = false);
  }, [token]);

  return (
    <Box>
      <Typography variant="h6">Recent Transactions</Typography>
      <List>
        {items.map((t) => (
          <React.Fragment key={t.id}>
            <ListItem alignItems="flex-start">
              <ListItemText primary={`${t.description} — $${Number(t.amount).toFixed(2)}`} secondary={`${t.date} • ${t.account_name || ""} • ${t.category_name || ""}`} />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
