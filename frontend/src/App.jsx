import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Accounts from "./pages/Accounts"
import Budgets from "./pages/Budgets"
import Reports from "./pages/Reports"

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/accounts" element={
        <PrivateRoute>
          <Accounts />
        </PrivateRoute>
      } />
      <Route path="/budgets" element={
        <PrivateRoute>
          <Budgets />
        </PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute>
          <Reports />
        </PrivateRoute>
      } />
    </Routes>
  )
}
