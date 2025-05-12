import { ChatOllama } from "@langchain/ollama";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { User } from "@shared/User";
import tools from "../tools/projectTools";

const llm = new ChatOllama({
  model: "qwen3:1.7b",
  temperature: 0.0,
});

// TODO: adicionar mais funções
// talvez deixar todas elas em um módulo separado?
const llmWithTools = llm.bindTools(tools);
const toolMapping = tools.reduce((acc, tool) => {
  acc[tool.name] = tool;
  return acc;
}, {} as Record<string, typeof tools[number]>);

export const sendChatMessage = async (message: string, userInfo: User) => {
  // TODO: utilizar o histórico de mensagens que ficar no frontend
  // mandar o histórico pro backend?
  // ou armazenar direto no backend. (evitar viadagem de serialização)
  console.warn(userInfo);
  const messages = [
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
      const tool = toolMapping[toolCall.name]; // ????????????????????????
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }
      const validatedArgs = tool.schema.parse(toolCall.args); // Validate or transform args
      // @ts-ignore
      const result = await tool.invoke(validatedArgs);
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
