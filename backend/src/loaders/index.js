import expressLoader from "./express.js";
import { connectDB } from "../config/database.js";

export default async (app) => {
  await connectDB();
  expressLoader(app);
};
