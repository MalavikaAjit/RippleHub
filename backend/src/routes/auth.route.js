import express from "express";
import {  signup } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/checkAuth", protectAuth, checkAuth);

router.post("/signup", signup);



router.post("/verifyEmail", verifyEmail);

router.post("/forgotPassword", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
