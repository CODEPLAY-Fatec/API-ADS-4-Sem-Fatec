import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  getProjectsService,
  getTasksService,
} from "../services/projectService";

const getProjectsServiceSchema = z.object({
  user: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string(),
      email: z.string().email(),
    })
    .describe("User to get projects for"),
});

const getUserProjectsTool = tool(
  async (input: z.infer<typeof getProjectsServiceSchema>) => {
    const { user } = input;
    return await getProjectsService({ ...user, password: "" });
  },
  {
    name: "get_user_projects",
    description:
      "Get all user projects and details such as ID, title, description, status, starting and finishing dates.",
    schema: getProjectsServiceSchema,
  },
);

const getProjectTasksSchema = z.object({
  projectId: z
    .number()
    .int()
    .nonnegative()
    .describe("Project ID to get tasks for"),
  userId: z.number().int().nonnegative().describe("User ID to get tasks for"),
  searchStatus: z
    .enum(["Fechado", "Em_andamento", "Concluido"])
    .optional()
    .describe("Status to filter tasks"),
  searchTaskUser: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("User ID to filter tasks"),
});

const getProjectTasksTool = tool(
  async (input: z.infer<typeof getProjectTasksSchema>) => {
    const { projectId, userId, searchStatus, searchTaskUser } = input;
    return await getTasksService(
      projectId,
      userId,
      searchStatus,
      searchTaskUser,
    );
  },
  {
    name: "get_project_tasks",
    description: "Get tasks in a project by it's ID and optional properties such as it's status and who the tasks belong to.",
    schema: getProjectTasksSchema,
  },
);

export default [getUserProjectsTool, getProjectTasksTool];
