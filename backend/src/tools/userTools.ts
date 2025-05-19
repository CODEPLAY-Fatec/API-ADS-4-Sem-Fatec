import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { getUserTasks } from "../services/projectService";

const getUserTasksSchema = z.object({
  user: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string().nonempty(),
      email: z.string().email().nonempty(),
    })
    .describe("User to get projects for"),
});

const getUserTasksTool = tool(
  async (input: z.infer<typeof getUserTasksSchema>) => {
    const { user } = input;
    return await getUserTasks(user.id);
  },
  {
    name: "get_user_tasks",
    description: "Get all tasks assigned to the user.",
    schema: getUserTasksSchema,
  },
);

export default [getUserTasksTool];
