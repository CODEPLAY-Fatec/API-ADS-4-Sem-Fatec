import { Router } from "express";
import { loginController } from "../controllers/authController";
import {
  createUserController,
  getAllUsersController,
  logoutController,
  meController,
  AttPasswordController,
  updateUserController,
  uploadFotoController,
  getFotoController
} from "../controllers/userController";
import { authenticateToken } from "../middleware/middleware";
import { uploadSingleImage } from "../controllers/uploadController";


const router: Router = Router();

router.post("/users", createUserController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.post("/login", loginController);
router.patch("/users/password", authenticateToken, AttPasswordController);
router.patch("/users", authenticateToken, updateUserController); //rota para atualizar o usuario logado, é so mandar o user como objeto
//router.get("/users", getAllUsersController);
router.post('/foto',uploadSingleImage , uploadFotoController);//rota exclusiva para mandar imagem



router.get('/foto',authenticateToken, getFotoController);//rota exclusiva para pegar imagem



export default router;
