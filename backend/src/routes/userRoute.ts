import { Router } from "express";
import { loginController } from "../controllers/authController";
import { createUserController, getAllUsersController, logoutController, meController } from "../controllers/userController";

const router: Router = Router();

router.post("/users", createUserController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.post("/login", loginController);
router.get("/users", getAllUsersController);

export default router;
