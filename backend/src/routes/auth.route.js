import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.get("/checkAuth", protectAuth, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verifyEmail", verifyEmail);

router.post("/forgotPassword", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;