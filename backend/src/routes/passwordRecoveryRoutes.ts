import express from "express";
import {
  requestRecoveryCode,
  verifyCode,
  resetPassword,
} from "../controllers/passwordRecoveryController";

const router = express.Router();

router.post("/request-code", requestRecoveryCode);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

export default router;
