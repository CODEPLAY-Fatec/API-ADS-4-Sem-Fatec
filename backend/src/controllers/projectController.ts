import Project from "@shared/Project";
import { Request, Response } from "express";
import {
    addUserToProjectService,
    createProjectService,
    deleteProjectService,
    getInstitutionsService,
    getProjectByIdService,
    getProjectsService,
    getProjectSubjectsService,
    removeUserFromProjectService,
    updateProjectService,
} from "../services/projectService";
import { getAllUsers, getUserByEmail, getUserInfo } from "../services/userService";
import { User } from "@shared/User";

export const createProjectController = async (req: Request, res: Response) => {
    const ProjectData: Project = req.body;

    // TODO: pegar o ID do usuário logado, e colocar como project.creator
    if (!ProjectData.name) {
        res.status(400).send({ message: "Nome do projeto é obrigatório." });
        return;
    }
    try {
        await createProjectService(ProjectData, await getUserInfo(req.cookies.token));
        res.status(201).send({ message: "Projeto criado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar projeto." });
        console.warn(error);
    }
};

export const updateProjectController = async (req: Request, res: Response) => {
    const ProjectData: Project = req.body; // recebe um projeto com propriedades opcionais. eu poderia trasnformar em Partial, mas...

    try {
        await updateProjectService(ProjectData, await getUserInfo(req.cookies.token));
        res.status(201).send({ message: "Projeto atualizado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao atualizar projeto." });
        console.warn(error);
    }
};

export const addUserToProjectController = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    const userEmail = req.body.user
    const user = await getUserByEmail(userEmail);
    if (isNaN(projectId) || !user) {
        res.status(400).send({ message: "ID do projeto ou usuário inválido." });
        return;
    }

    try {
        await addUserToProjectService(projectId, user.id, await getUserInfo(req.cookies.token));
        res.status(201).send({ message: "Usuário adicionado ao projeto com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao adicionar usuário ao projeto." });
        console.warn(error);
    }
}

export const removeUserFromProjectController = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.user, 10);
    
    if (isNaN(projectId) || isNaN(userId)) {
        res.status(400).send({ message: "ID do projeto ou usuário inválido." });
        return;
    }

    try {
        await removeUserFromProjectService(projectId, userId, await getUserInfo(req.cookies.token));
        res.status(201).send({ message: "Usuário removido do projeto com sucesso!" });
    } catch(error) {
        res.status(500).send({ message: "Erro ao remover usuário do projeto." });
        console.warn(error);
    }
}

export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const userInfo = await getUserInfo(req.cookies.token);
        if (userInfo.id === undefined) {
            res.status(400).send({ message: "User ID is missing." });
            return;
        }
        const result = await getProjectsService(userInfo);
        const users = (await getAllUsers())
        .filter((user => result.find(project => project.creator === user.id))).map(user => {
            return {id: user.id, name: user.name, email: user.email}
        });
        // considerar usar Set para filtrar mais rápido, não sei se vai ser necessário.
        res.status(200).send({result, users});
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        res.status(500).send({ message: "Erro ao buscar projetos." });
    }
};

export const getProjectByIdController = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        res.status(400).send({ message: "ID do projeto inválido." });
        return;
    }

    try {
        const project = await getProjectByIdService(projectId, await getUserInfo(req.cookies.token));
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar projeto." });
    }
}

export const getProjectSubjectsController = async (req: Request, res: Response) => {
    try {
        const result = await getProjectSubjectsService();
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar projetos." });
    }
};

export const getInstitutionsController = async (req: Request, res: Response) => {
    try {
        const result = await getInstitutionsService();
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar instituições." });
    }
};

export const deleteProjectController = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        res.status(400).send({ message: "ID do projeto inválido." });
        return;
    }

    try {
        await deleteProjectService(projectId, await getUserInfo(req.cookies.token));
        res.status(200).send({ message: "Projeto deletado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao deletar projeto." });
        console.warn(error);
    }
};
