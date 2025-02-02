import express from "express";
import ActressController from "../controllers/actress.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";
import fs from 'fs';
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let dir = `uploads/actress`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
  
    filename: (_, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + "webp");
    },
  });
  
  const upload = multer({ storage: storage }).fields([
    { name: "file", maxCount: 1 },
  ]);

export const router = express.Router();

router.get("/", isAuthorised, ActressController.getActress);
router.post("/", isAuthorised, isAdmin,upload, ActressController.addActress);
router.patch("/:id", isAuthorised, isAdmin,upload, ActressController.updateActress);
router.delete("/:id", isAuthorised, isAdmin, ActressController.deleteActress);
