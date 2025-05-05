"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

export default function ChatComponent() {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await axios.post("http://localhost:5000/chatbot", { message: input });
            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error communicating with chatbot:", error);
            const errorMessage = { sender: "bot", text: "Desculpe, ocorreu um erro ao processar sua mensagem." };
            setMessages((prev) => [...prev, errorMessage]);
        }

        setInput("");
    };

    return (
        <div className="border rounded-lg p-4 max-w-md mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">Chatbot</h2>
            <div className="h-64 overflow-y-auto border p-2 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex">
                <Input
                    type="text"
                    className="flex-grow border rounded-l-lg p-2"
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button className="bg-blue-500 text-white px-4 rounded-r-lg" onClick={sendMessage}>
                    Enviar
                </Button>
            </div>
        </div>
    );
}
