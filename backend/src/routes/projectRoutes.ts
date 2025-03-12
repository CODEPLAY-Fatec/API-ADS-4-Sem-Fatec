import { Router } from "express";
import {
  createProjectController,
  getProjectsController,
  getProjectSubjectsController,
} from "../controllers/projectController";
import { getProjectSubjectsService } from "../services/projectService";
const router: Router = Router();

router.post("/projects", createProjectController);
router.get("/projects", getProjectsController);
router.get("/projects/subjects", getProjectSubjectsController);

export default router;
