import { Router } from "express";
import { createUserController, logoutController } from "../controllers/userController";
import { meController } from "../controllers/userController";
import { loginController } from "../controllers/authController";

const router: Router = Router();

router.post("/users", createUserController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.post("/login", loginController);

export default router;