import express from "express";
import JudgeController from "../controllers/judge.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/users.js";

export const router = express.Router();

router.get("/", isAuthorised, isAdmin, JudgeController.getAllJudges);
router.post("/", isAuthorised, isAdmin, JudgeController.createJudge);
router.patch("/:id", isAuthorised, isAdmin, JudgeController.updateJudge);
router.delete("/:id", isAuthorised, isAdmin, JudgeController.deleteJudge);
router.post("/score", isAuthorised, JudgeController.addScore);