import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { getUserTasks } from "../services/projectService";

const getUserTasksSchema = z.object({
  userId: z.number().int().nonnegative().describe("User ID to get tasks for"),
});

const getUserTasksTool = tool(
  (input: z.infer<typeof getUserTasksSchema>) => {
    const { userId } = input;
    getUserTasks(userId);
  },
  {
    name: "get_user_tasks",
    description:
      "Get all tasks assigned to the user.",
    schema: getUserTasksSchema,
  },
);

export default [getUserTasksTool];
