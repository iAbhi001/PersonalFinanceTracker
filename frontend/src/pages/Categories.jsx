import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/api.js";
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

export default function Categories() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    const res = await api.get("/categories", { headers: { Authorization: `Bearer ${token}` } });
    setCategories(res.data);
  };

  const handleAdd = async () => {
    if (!newCategory) return;
    await api.post("/categories", { name: newCategory }, { headers: { Authorization: `Bearer ${token}` } });
    setNewCategory("");
    fetchCategories();
  };

  useEffect(() => { if (token) fetchCategories(); }, [token]);

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="New Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <Button onClick={handleAdd} sx={{ ml: 1 }}>Add</Button>
      <List>
        {categories.map(c => <ListItem key={c.id}><ListItemText primary={c.name} /></ListItem>)}
      </List>
    </Box>
  );
}
