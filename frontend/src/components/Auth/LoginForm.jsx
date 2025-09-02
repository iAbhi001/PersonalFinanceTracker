// src/components/Auth/LoginForm.js
import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { login, getGoogleAuthUrl } from "../../api/authApi.js";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function LoginForm() {
  const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If backend redirected with token in query param, capture it
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, setToken, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await login({ email, password });
      setToken(token);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    window.location.href = getGoogleAuthUrl();
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>
      <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
        Sign in
      </Button>
      <Button variant="outlined" fullWidth onClick={handleGoogle} sx={{ mt: 1 }}>
        Sign in with Google
      </Button>
    </Box>
  );
}
