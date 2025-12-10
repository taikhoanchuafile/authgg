import express from "express";
import {
  googleLoginController,
  logoutController,
  refreshTokenController,
} from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/google", googleLoginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);

export default router;
