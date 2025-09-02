// src/App.js
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import BudgetPage from "./pages/BudgetPage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  if (loading) return null; // or a spinner
  return token ? children : <Navigate to="/login" replace />;
}

function TopBar() {
  const { token, setToken, user } = useContext(AuthContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Finance
        </Typography>
        {token ? (
          <>
            <Typography sx={{ mr: 2 }}>{user?.name}</Typography>
            <Button color="inherit" onClick={() => setToken(null)}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopBar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <PrivateRoute>
                <BudgetPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
