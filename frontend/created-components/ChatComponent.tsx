"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatComponent() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("/api/chat", { message: input });
      const botMessage = { sender: "bot", text: response.data.message.replace(/<think>[\s\S]*?<\/think>/g, '')};
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = {
        sender: "bot",
        text: "**Erro:** Desculpe, ocorreu um problema ao processar sua mensagem.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="border rounded-xl p-4 max-w-md mx-auto mt-8 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Chatbot</h2>
      <div className="h-64 overflow-y-auto p-2 mb-4 space-y-3 bg-gray-50 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                disallowedElements={["script", "iframe"]}
                unwrapDisallowed
                components={{
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-4" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-4" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-gray-200 rounded px-1 py-0.5 font-mono text-sm"
                      {...props}
                    />
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <div
                className={`text-xs mt-1 ${
                  msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.sender === "user" ? "Você" : "Assistente"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          className="flex-grow rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 shadow-sm transition-colors"
          onClick={sendMessage}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
