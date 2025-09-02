// src/api/budgetApi.js
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:4000";

function client(token) {
  return axios.create({ baseURL: API_BASE, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
}

export async function getBudgets(token) {
  const res = await client(token).get("/budgets");
  return res.data;
}

export async function setBudget(token, payload) {
  // payload: { category_id, limit_amount }
  const res = await client(token).post("/budgets", payload);
  return res.data;
}

export async function deleteBudget(token, id) {
  const res = await client(token).delete(`/budgets/${id}`);
  return res.data;
}
