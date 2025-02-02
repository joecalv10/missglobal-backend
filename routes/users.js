import express from "express";
import UserController from "../controllers/users.js";
import { isAuthorised } from "../middlewares/auth.js";

export const router = express.Router();

router.get("/",isAuthorised, UserController.getUser);
