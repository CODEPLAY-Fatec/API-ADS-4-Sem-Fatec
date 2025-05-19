"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatComponent({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");

  // se der ruim tem q tirar isso
  useEffect(() => {
    if (visible) {
      document.body.style.paddingRight = "20rem";
      document.body.style.transition = "padding-right 0.3s ease-in-out";
    } else {
      document.body.style.transition = "padding-right 0.3s ease-in-out";
      document.body.style.paddingRight = "0";
    }
    return () => {
      document.body.style.paddingRight = "0";
      document.body.style.transition = "";
    };
  }, [visible]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/chat",
        { message: input },
        { timeout: 0, withCredentials: true },
      );
      const botMessage = {
        sender: "bot",
        text: response.data.message.replace(/<think>[\s\S]*?<\/think>/g, ""),
      };
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
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Chatbot</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="h-[calc(100%-120px)] overflow-y-auto p-4 space-y-3">
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
      <div className="flex gap-2 p-4 border-t">
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
