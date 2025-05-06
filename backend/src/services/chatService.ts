import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { User } from "@shared/User";
import { getProjectsService } from "./projectService";
import { z } from "zod";

const llm = new ChatOllama({
  model: "qwen3",
  temperature: 0.0,
});

const getProjectsServiceSchema = z.object({
  user: z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    email: z.string().email(),
  }),
});
const getUserProjectsTool = tool(
  async (input: z.infer<typeof getProjectsServiceSchema>) => {
    const { user } = input;
    return await getProjectsService({ ...user, password: "" });
  },
  {
    name: "get_user_projects",
    description: "Get user projects",
    schema: getProjectsServiceSchema,
  },
);
// TODO: adicionar mais funções
// talvez deixar todas elas em um módulo separado?
const llmWithTools = llm.bindTools([getUserProjectsTool]);
const toolMapping = {
  get_user_projects: getUserProjectsTool,
};

export const sendChatMessage = async (message: string, userInfo: User) => {
    // TODO: utilizar o histórico de mensagens que ficar no frontend
    // mandar o histórico pro backend?
    // ou armazenar direto no backend. (evitar viadagem de serialização)
  console.warn(userInfo);
  const messages = [
    // new SystemMessage(
    //   `You are a helpful assistant. Make sure your responses are formattted using HTML.`,
    // ),
    new HumanMessage(`User: ${JSON.stringify(userInfo)}\n Message: ${message}`),
  ];
  let llmResponse = await llmWithTools.invoke(messages);
  console.log("llmResponse", llmResponse);
  while (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
    messages.push(
      new AIMessage({
        content: "",
        tool_calls: llmResponse.tool_calls,
      }),
    );
    for (let toolCall of llmResponse.tool_calls || []) {
      const tool = toolMapping[toolCall.name as keyof typeof toolMapping]; // ????????????????????????
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }
      const result = await tool.invoke(
        toolCall.args as z.infer<typeof getProjectsServiceSchema>,
      );
      messages.push(
        new ToolMessage({
          content: JSON.stringify(result),
          name: toolCall.name || "unknown_tool", // Fallback to a default name if undefined
          tool_call_id: toolCall.id || "unknown_id", // Fallback to a default ID if undefined
        }),
      );
      llmResponse = await llmWithTools.invoke(messages);
      console.log("llmResponse", llmResponse);
    }
  }
  console.log("messages", messages);
  console.log("llmResponse", llmResponse);
  return llmResponse.content;
};
