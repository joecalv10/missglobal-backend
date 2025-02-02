import express from "express";
import UserController from "../controllers/user.js";
import { isAuthorised } from "../middlewares/auth.js";

export const router = express.Router();

router.get("/",isAuthorised, UserController.getUser);
