import { Router } from "express";
import {
  createProjectController,
  getInstitutionsController,
  getProjectsController,
  getProjectSubjectsController,
} from "../controllers/projectController";
const router: Router = Router();

router.post("/projects", createProjectController);
router.get("/projects", getProjectsController);
router.get("/projects/subjects", getProjectSubjectsController);
router.get("/projects/institutions", getInstitutionsController);

export default router;
