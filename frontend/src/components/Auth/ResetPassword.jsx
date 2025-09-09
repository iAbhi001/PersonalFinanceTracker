// src/components/Auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Reset token from URL:", token);
    if (!token) setMessage("Invalid or missing token");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage("Invalid or missing token");
    if (!password) return setMessage("Please enter a new password");

    setLoading(true);
    setMessage("");

    try {
      console.log("Submitting reset password request", { token, password });

      const res = await fetch("http://localhost:4000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      // Safe parsing
      let data = {};
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: "Invalid server response" };
      }

      console.log("Response status:", res.status);
      console.log("Response body:", data);

      if (!res.ok) {
        setMessage(data.error || "Failed to reset password");
      } else {
        setMessage("Password reset successfully! Redirecting to login...");
        setPassword("");
        // Redirect after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
