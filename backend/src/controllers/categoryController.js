// backend/src/controllers/categoryController.js
import { createCategory, listCategories as listCategoriesModel } from "../models/Category.js";

// Add a new category
export async function addCategory(req, res) {
  try {
    const user_id = req.user.id;
    const { name } = req.body;
    const category = await createCategory({ user_id, name });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add category" });
  }
}

// List categories
export async function listCategories(req, res) {
  try {
    const user_id = req.user.id;
    const categories = await listCategoriesModel(user_id);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list categories" });
  }
}
