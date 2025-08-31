import * as BudgetService from "./budget.model.js";

export const getBudgets = async (req, res, next) => {
  try { res.json(await BudgetService.findAll()); } 
  catch (e) { next(e); }
};

export const addBudget = async (req, res, next) => {
  try { res.json(await BudgetService.create(req.body)); } 
  catch (e) { next(e); }
};

export const getBudgetUsage = async (req, res, next) => {
  try { res.json(await BudgetService.usage()); } 
  catch (e) { next(e); }
};
