// src/components/Charts/PieChart.js
import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336", "#9c27b0", "#00acc1", "#8d6e63", "#9e9d24"];

export default function SpendingPieChart({ data = [] }) {
  // data: [{ category, value }]
  const formatted = data.map((d) => ({ name: d.category, value: Number(d.value) }));

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <Typography variant="subtitle1" mb={1}>
        Spending by Category
      </Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={formatted} cx="50%" cy="50%" outerRadius={90} label>
            {formatted.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
