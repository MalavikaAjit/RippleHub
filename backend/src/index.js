import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import path from "path";
import { fileURLToPath } from 'url';

import postInteractionRoutes from "./routes/postInteraction.routes.js";


import authRoutes from "./routes/auth.route.js";

import postRoutes from "./routes/post.route.js";

import profileRoutes from "./routes/profile.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2057;
app.use(cors({ origin: "http://localhost:5173", credentials: true, })); //allows us to make requests from the frontend to the backend



app.use(express.json()); //allows us to parse incoming requests:req.body 

app.use("/uploads", express.static("uploads"));


app.use(cookieParser()); //allows us to parse cookies from incoming requests:req.cookies

app.use("/api/auth", authRoutes); //routes for api auth
app.use("/api/", postInteractionRoutes);

app.use("/api", postRoutes);

app.use("/api",profileRoutes);




app.listen(PORT, () => {
  connectDB();
  console.log("Server is Running on port: ", PORT);
});