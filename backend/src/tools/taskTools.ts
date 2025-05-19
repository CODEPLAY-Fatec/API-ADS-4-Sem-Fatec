import { z } from "zod";
import { getTasksService } from "../services/projectService";
import { tool } from "@langchain/core/tools";

// getProjectTasks
const getProjectTasksSchema = z.object({
  projectId: z
    .number()
    .int()
    .nonnegative()
    .describe("Project ID to get tasks for"),
  user: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string().nonempty(),
      email: z.string().email().nonempty(),
    })
    .describe("User to get projects for"),
  searchStatus: z
    .enum(["Fechado", "Em_andamento", "Concluido"])
    .optional()
    .describe("Status to filter tasks"),
  searchTaskUser: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("User ID to filter by task owner"),
});

const getProjectTasksTool = tool(
  async (input: z.infer<typeof getProjectTasksSchema>) => {
    const { projectId, user, searchStatus, searchTaskUser } = input;
    return await getTasksService(
      projectId,
      user.id,
      searchStatus,
      searchTaskUser,
    );
  },
  {
    name: "get_project_tasks",
    description:
      "Get tasks in a project by it's ID and optional properties such as it's status and who the tasks belong to.",
    schema: getProjectTasksSchema,
  },
);

export default [getProjectTasksTool];
