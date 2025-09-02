// src/api/transactionApi.js
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:4000";

function client(token) {
  return axios.create({ baseURL: API_BASE, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
}

export async function addTransaction(token, data) {
  const res = await client(token).post("/transactions", data);
  return res.data;
}

export async function listTransactions(token) {
  const res = await client(token).get("/transactions");
  return res.data;
}

export async function getCategorySummary(token, month) {
  const res = await client(token).get("/transactions/summary/category", { params: { month } });
  return res.data;
}

export async function getOutstanding(token) {
  const res = await client(token).get("/transactions/outstanding");
  return res.data;
}

export async function uploadStatement(token, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await client(token).post("/transactions/upload-statement", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
