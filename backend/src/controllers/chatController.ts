import { Request, Response } from "express";
import { getUserInfo } from "../services/userService";
import { sendChatMessage } from "../services/chatService";

export const sendChatMessageController = async (req: Request, res: Response) => {
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

    // const ProjectData: Project = req.body;
    //
    // // TODO: pegar o ID do usuário logado, e colocar como project.creator
    // if (!ProjectData.name) {
    //     res.status(400).send({ message: "Nome do projeto é obrigatório." });
    //     return;
    // }
    // try {
    //     await createProjectService(ProjectData, await getUserInfo(req.cookies.token));
    //     res.status(201).send({ message: "Projeto criado com sucesso!" });
    // } catch (error) {
    //     res.status(500).send({ message: "Erro ao criar projeto." });
    //     console.warn(error);
    // }
};
