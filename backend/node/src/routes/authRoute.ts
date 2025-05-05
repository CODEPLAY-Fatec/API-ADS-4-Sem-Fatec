import { Router } from "express";
import { loginController } from "../controllers/authController";

const router : Router = Router();

router.post("/login", loginController);

export default router;

