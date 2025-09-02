// src/api/authApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:4000";

function client(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.create({ baseURL: API_BASE, headers });
}

export async function signup(payload) {
  const res = await axios.post(`${API_BASE}/auth/signup`, payload);
  return res.data;
}

export async function login(payload) {
  const res = await axios.post(`${API_BASE}/auth/login`, payload);
  return res.data; // { token, user }
}

export async function forgotPassword(email) {
  const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
  return res.data;
}

export function getGoogleAuthUrl() {
  // just use backend route
  return `${API_BASE}/auth/google`;
}

export async function getMe(token) {
  const res = await client(token).get("/auth/me");
  return res.data;
}
