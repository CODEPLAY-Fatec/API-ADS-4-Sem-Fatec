import { Router } from "express";
import {
    addUserToProjectController,
    createProjectController,
    deleteProjectController,
    getInstitutionsController,
    getProjectsController,
    getProjectSubjectsController,
    removeUserFromProjectController,
    updateProjectController,
    getProjectByIdController
} from "../controllers/projectController";
const router: Router = Router();

router.post("/projects", createProjectController);
router.get("/projects", getProjectsController);
router.get("/projects/subjects", getProjectSubjectsController);
router.get("/projects/institutions", getInstitutionsController);
router.get("/projects/:id", getProjectByIdController);
router.patch("/projects", updateProjectController);
router.delete("/projects/:id", deleteProjectController); // Add delete route
router.post("/projects/:id/user", addUserToProjectController)
router.delete("/projects/:id/:user", removeUserFromProjectController)

export default router;
