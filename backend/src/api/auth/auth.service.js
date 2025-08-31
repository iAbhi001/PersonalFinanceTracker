import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthModel from "./auth.model.js";

export const register = async ({ email, password, name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await AuthModel.createUser({ email, password: hashedPassword, name });
};

export const login = async ({ email, password }) => {
  const user = await AuthModel.findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};
