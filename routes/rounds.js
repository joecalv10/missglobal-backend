import express from "express";
import RoundController from "../controllers/rounds.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";

export const router = express.Router();

router.post("/", isAuthorised, isAdmin, RoundController.addRound);
router.get("/", isAuthorised, isAdmin, RoundController.getAllRound);
router.get("/current", isAuthorised, RoundController.getCurrentRound);
router.delete("/:id", isAuthorised, isAdmin, RoundController.deleteRound);
router.patch("/:id", isAuthorised, isAdmin, RoundController.updateRound);
router.patch("/:id/end", isAuthorised, isAdmin, RoundController.endRound);
router.get("/winners/:id", RoundController.getWinners)
router.get("/winner/prevRound", isAuthorised, RoundController.getPrevRoundWinners);