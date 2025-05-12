import { Request, Response } from "express";
import { getUserInfo } from "../services/userService";
import { sendChatMessage } from "../services/chatService";

export const sendChatMessageController = async (req: Request, res: Response) => {
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Keep-Alive", "timeout=300");
    const { message } = req.body;
    const User = await getUserInfo(req.cookies.token);

    try {
        const response = await sendChatMessage(message, User);
        console.warn(response)
        res.status(200).send({ message: response });
    } catch (error) {
        res.status(500).send({ message: "Erro ao enviar mensagem." });
        console.warn(error);
    }
};
