import * as AuthService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await AuthService.login(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
