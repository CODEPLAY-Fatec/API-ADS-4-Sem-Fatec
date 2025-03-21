import { Router } from "express";
import {
    createProjectController,
    deleteProjectController,
    getInstitutionsController,
    getProjectsController,
    getProjectSubjectsController,
    updateProjectController,
} from "../controllers/projectController";
const router: Router = Router();

router.post("/projects", createProjectController);
router.get("/projects", getProjectsController);
router.get("/projects/subjects", getProjectSubjectsController);
router.get("/projects/institutions", getInstitutionsController);
router.patch("/projects", updateProjectController);
router.delete("/projects/:id", deleteProjectController); // Add delete route

export default router;
