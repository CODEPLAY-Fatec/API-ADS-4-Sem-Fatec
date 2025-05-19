import { ChatOllama } from "@langchain/ollama";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { User } from "@shared/User";
import projectTools from "../tools/projectTools";
import taskTools from "../tools/taskTools";
import userTools from "../tools/userTools";
const tools = [...projectTools, ...taskTools, ...userTools];
const llm = new ChatOllama({
  model: "qwen3:4b",
  temperature: 0.0,
});

const llmWithTools = llm.bindTools(tools);
const toolMapping = tools.reduce(
  (acc, tool) => {
    acc[tool.name] = tool;
    return acc;
  },
  {} as Record<string, (typeof tools)[number]>,
);

export const sendChatMessage = async (message: string, userInfo: User) => {
  // TODO: utilizar o histórico de mensagens que ficar no frontend
  // mandar o histórico pro backend?
  // ou armazenar direto no backend. (evitar viadagem de serialização)
  console.warn(userInfo);
  const messages = [
    new SystemMessage(
      `Você é um assistente de IA que ajuda a gerenciar projetos e tarefas. Responda apenas com o necessário. Objeto do usuário: ${JSON.stringify(userInfo)}`,
    ),
    new HumanMessage(message),
  ];
  console.log("messages", messages);
  let llmResponse = await llmWithTools.invoke(messages);
  console.log("llmResponse", JSON.stringify(llmResponse));
  while (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
    messages.push(
      new AIMessage({
        content: "",
        tool_calls: llmResponse.tool_calls,
      }),
    );
    for (let toolCall of llmResponse.tool_calls || []) {
      const tool = toolMapping[toolCall.name];
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }
      try {
        toolCall.args.user = userInfo;
        const validatedArgs = tool.schema.parse(toolCall.args);
        // @ts-ignore
        const result = await tool.invoke(validatedArgs);
        console.log("result", result);
        messages.push(
          new ToolMessage({
            content: JSON.stringify(result),
            name: toolCall.name || "unknown_tool",
            tool_call_id: toolCall.id || "unknown_id",
          }),
        );
      } catch (error) {
        console.error("Error validating tool args:", error);
        messages.push(
          new ToolMessage({
            content: JSON.stringify(error),
            name: toolCall.name || "unknown_tool",
            tool_call_id: toolCall.id || "unknown_id",
          }),
        );
      }
      // @ts-ignore
      llmResponse = await llmWithTools.invoke(messages);
      console.log("llmResponse", JSON.stringify(llmResponse));
    }
  }
  console.log("messages", messages);
  console.log("llmResponse", llmResponse);
  return llmResponse.content;
};
