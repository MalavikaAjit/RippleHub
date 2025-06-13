import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2057;

app.use(express.json()); //allows us to parse incoming requests:req.body

app.use("/api/auth", authRoutes); //routes for api auth

app.listen(PORT, () => {
  connectDB();
  console.log("Server is Running on port: ", PORT);
});
