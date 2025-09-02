// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("pft_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const me = await getMe(token);
        if (!mounted) return;
        setUser(me);
      } catch {
        setUser(null);
        localStorage.removeItem("pft_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [token]);

  function saveToken(t) {
    if (t) {
      localStorage.setItem("pft_token", t);
      setToken(t);
    } else {
      localStorage.removeItem("pft_token");
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
