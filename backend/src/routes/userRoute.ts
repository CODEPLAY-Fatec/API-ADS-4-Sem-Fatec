import { Router } from "express";
import { createUserController } from "../controllers/userController";

const router: Router = Router();

router.post("/users", createUserController);

export default router;