// src/components/Auth/SignupForm.js
import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { signup } from "../../api/authApi.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const { setToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await signup({ name, email, password });
      if (data.token) {
        setToken(data.token);
        navigate("/dashboard");
      } else {
        // older backend returns userId and not token in signup route — handle both
        if (data.userId) {
          alert("Signup successful. Please log in.");
          navigate("/login");
        }
      }
    } catch (err) {
      alert(err?.response?.data?.error || "Signup failed");
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Create account
      </Typography>
      <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Sign up
      </Button>
    </Box>
  );
}
