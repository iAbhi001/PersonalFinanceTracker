// src/pages/LoginPage.js
import React from "react";
import { Container, Box, Link } from "@mui/material";
import LoginForm from "../components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <LoginForm />
        <Box mt={2}>
          <Link href="/signup">Don't have an account? Sign up</Link>
        </Box>
        <Box mt={1}>
          <Link href="/forgot-password">Forgot password?</Link>
        </Box>
      </Box>
    </Container>
  );
}
