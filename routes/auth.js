import express from "express";
import AuthController from "../controllers/auth.js";

export const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh", AuthController.refreshToken);
router.get("/logout", AuthController.logout);