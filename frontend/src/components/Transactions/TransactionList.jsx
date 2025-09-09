// src/components/Transactions/TransactionList.jsx
import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

export default function TransactionList({ transactions }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Account</TableCell>
          <TableCell>Category</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.date}</TableCell>
            <TableCell>{t.description}</TableCell>
            <TableCell>${Number(t.amount).toFixed(2)}</TableCell>
            <TableCell>{t.account_name || t.account_id}</TableCell>
            <TableCell>{t.category_name || t.category_id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
