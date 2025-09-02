// src/components/Auth/ForgotPassword.js
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      alert("Failed to send reset email");
    }
  }

  if (sent) {
    return (
      <Box>
        <Typography>Check your inbox — if that email exists we'll send a reset link.</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Forgot password</Typography>
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" variant="contained">
        Send reset link
      </Button>
    </Box>
  );
}
