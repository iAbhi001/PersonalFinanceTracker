// src/api/transactionApi.js
import axios from "axios";

// Match your backend routes — remove /api if your backend does not use it
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function client(token) {
  return axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ===== Transactions =====
export async function addTransaction(token, data) {
  const res = await client(token).post("/transactions", data);
  return res.data;
}

export async function listTransactions(token) {
  const res = await client(token).get("/transactions");
  return res.data;
}

export async function getCategorySummary(token, month) {
  const res = await client(token).get("/transactions/summary/category", {
    params: { month },
  });
  return res.data;
}

export async function getOutstanding(token) {
  const res = await client(token).get("/transactions/outstanding");
  return res.data;
}

// ===== Accounts =====
export async function listAccounts(token) {
  const res = await client(token).get("/accounts");
  return res.data;
}

export async function addAccount(token, data) {
  const res = await client(token).post("/accounts", data);
  return res.data;
}

// ===== Categories =====
export async function listCategories(token) {
  const res = await client(token).get("/categories");
  return res.data;
}

export async function addCategory(token, data) {
  const res = await client(token).post("/categories", data);
  return res.data;
}
