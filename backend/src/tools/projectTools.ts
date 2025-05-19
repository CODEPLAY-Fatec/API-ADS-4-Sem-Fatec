import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  getProjectsService,
  getProjectByIdService,
} from "../services/projectService";

// getUserProjects
const getUserProjectsSchema = z.object({
  user: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string(),
      email: z.string().email(),
    })
    .describe("User to get projects for"),
});

const getUserProjectsTool = tool(
  async (input: z.infer<typeof getUserProjectsSchema>) => {
    const { user } = input;
    return await getProjectsService({ ...user, password: "" });
  },
  {
    name: "get_user_projects",
    description:
      "Get all projects the user is in.",
    schema: getUserProjectsSchema,
  },
);

// getProjectById
const getProjectByIdSchema = z.object({
  projectId: z
    .number()
    .int()
    .nonnegative()
    .describe("Project ID to get tasks for"),
  user: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string(),
      email: z.string().email(),
    })
    .describe("User to get projects for"),
});

const getProjectByIdTool = tool(
  async (input: z.infer<typeof getProjectByIdSchema>) => {
    const { projectId, user } = input;
    return await getProjectByIdService(projectId, { ...user, password: "" });
  },
  {
    name: "get_project_by_id",
    description: "Get a project by it's ID.",
    schema: getProjectByIdSchema,
  },
);

export default [getUserProjectsTool, getProjectByIdTool];
