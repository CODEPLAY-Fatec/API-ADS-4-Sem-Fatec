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
    getProjectByIdController,
    createTaskController,
    getTasksController,
    updateTaskController,
    addUserTaskController
} from "../controllers/projectController";
const router: Router = Router();

router.post("/projects", createProjectController);
router.get("/projects", getProjectsController);
router.get("/projects/subjects", getProjectSubjectsController);
router.get("/projects/institutions", getInstitutionsController);
router.get("/projects/:id", getProjectByIdController);
router.patch("/projects", updateProjectController);
router.delete("/projects/:id", deleteProjectController); // Add delete route
router.post("/projects/:id/user", addUserToProjectController);
router.delete("/projects/:id/:user", removeUserFromProjectController);
router.post("/projects/:id/task", createTaskController);
router.patch("/projects/tasks", addUserTaskController );
router.get("/projects/:id/tasks", getTasksController);
router.patch("/projects/tasks/:id", updateTaskController);
router.delete("/projects/tasks/:id", deleteProjectController);

export default router;
