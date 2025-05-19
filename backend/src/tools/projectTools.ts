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
      name: z.string().nonempty(),
      email: z.string().email().nonempty(),
    })
    .describe("User to get projects for"),
  searchName: z.string().optional().describe("Name to filter projects"),
  searchCreator: z
    .string()
    .optional()
    .describe("Creator name to filter projects"),
  searchInst: z.string().optional().describe("Institution to filter projects"),
  searchSubj: z.string().optional().describe("Subject to filter projects"),
  dateStart: z.date().optional().describe("Start date to filter projects"),
  dateFinish: z.date().optional().describe("Finish date to filter projects"),
  searchStatus: z
    .enum(["Fechado", "Em_andamento", "Concluido"])
    .optional()
    .describe("Status to filter projects"),
});

const getUserProjectsTool = tool(
  async (input: z.infer<typeof getUserProjectsSchema>) => {
    const {
      user,
      searchName,
      searchCreator,
      searchInst,
      searchSubj,
      dateStart,
      dateFinish,
      searchStatus,
    } = input;
    return await getProjectsService(
      { ...user, password: "" },
      searchName,
      searchCreator,
      searchInst,
      searchSubj,
      dateStart,
      dateFinish,
      searchStatus,
    );
  },
  {
    name: "get_user_projects",
    description: "Get all projects the user is in.",
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
    description: "Get a project's information and it's members by it's ID.",
    schema: getProjectByIdSchema,
  },
);

export default [getUserProjectsTool, getProjectByIdTool];
