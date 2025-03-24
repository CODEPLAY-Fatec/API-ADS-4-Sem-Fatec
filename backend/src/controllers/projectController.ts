import Project from "@shared/Project";
import { Request, Response } from "express";
import {
    addUserToProjectService,
    createProjectService,
    deleteProjectService,
    getInstitutionsService,
    getProjectsService,
    getProjectSubjectsService,
    removeUserFromProjectService,
    updateProjectService,
} from "../services/projectService";
import { getAllUsers, getUserInfo } from "../services/userService";
import { User } from "@shared/User";

export const createProjectController = async (req: Request, res: Response) => {
    const ProjectData: Project = req.body;
    console.log(ProjectData);

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
    console.log(ProjectData);

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
    const userId = parseInt(req.params.user, 10);

    if (isNaN(projectId) || isNaN(userId)) {
        res.status(400).send({ message: "ID do projeto ou usuário inválido." });
        return;
    }

    try {
        await addUserToProjectService(projectId, userId, await getUserInfo(req.cookies.token));
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
        console.log(result);
        console.log(users);
        res.status(200).send({result, users});
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        res.status(500).send({ message: "Erro ao buscar projetos." });
    }
};

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
