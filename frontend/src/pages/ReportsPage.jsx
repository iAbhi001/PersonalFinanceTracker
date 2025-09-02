// src/pages/ReportsPage.js
import React, { useContext, useState } from "react";
import { Container, Box, Button, TextField } from "@mui/material";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:4000";

export default function ReportsPage() {
  const { token } = useContext(AuthContext);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  async function downloadReport() {
    try {
      const res = await axios.get(`${API_BASE}/reports/monthly`, {
        params: { month },
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${month}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert("Failed to download report");
    }
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ maxWidth: 420 }}>
        <TextField label="Month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} fullWidth />
        <Button variant="contained" sx={{ mt: 2 }} onClick={downloadReport}>
          Download Monthly Report
        </Button>
      </Box>
    </Container>
  );
}
