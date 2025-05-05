import { Router } from "express";
import {
  requestRecoveryCode,
  verifyCode,
  resetPassword,
} from "../controllers/passwordRecoveryController";

const router: Router = Router();

router.post("/request-code", requestRecoveryCode);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

export default router;
