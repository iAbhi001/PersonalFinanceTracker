// src/pages/SignupPage.js
import React from "react";
import { Container, Box } from "@mui/material";
import SignupForm from "../components/Auth/SignupForm";

export default function SignupPage() {
  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <SignupForm />
      </Box>
    </Container>
  );
}
