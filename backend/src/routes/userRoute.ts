import { Router } from "express";
import { loginController } from "../controllers/authController";
import { createUserController, getAllUsersController, logoutController, meController,AttPasswordController,upadateUserController } from "../controllers/userController";
import { authenticateToken } from "../middleware/middleware";

const router: Router = Router();

router.post("/users", createUserController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.post("/login", loginController);
router.patch("/users/password",authenticateToken, AttPasswordController);
router.patch("users",authenticateToken,upadateUserController);//rota para atualizar o usuario logado, é so mandar o user como objeto 
//router.get("/users", getAllUsersController);

export default router;
