import express from "express";
import { meController } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", meController);

router.get("/test", (req, rest) => rest.sendStatus(204));

export default router;
