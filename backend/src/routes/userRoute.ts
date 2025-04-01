import { Router } from "express";
import { loginController } from "../controllers/authController";
import { createUserController, getAllUsersController, logoutController, meController,AttPasswordController } from "../controllers/userController";
import { authenticateToken } from "../middleware/middleware";

const router: Router = Router();

router.post("/users", createUserController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.post("/login", loginController);
router.patch("/users/password",authenticateToken, AttPasswordController);
//router.get("/users", getAllUsersController);

export default router;
