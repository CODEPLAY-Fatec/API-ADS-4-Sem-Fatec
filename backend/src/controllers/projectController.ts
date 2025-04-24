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
    createTaskService,
    addUserToTaskService,
    getTasksService,
    updateTaskService,
    deleteTaskService,
    getUserTasks
} from "../services/projectService";
import { getAllUsers, getUserByEmail, getUserById, getUserInfo } from "../services/userService";

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
        const usuarioAdd = await addUserToProjectService(projectId, user.id, await getUserInfo(req.cookies.token));
        res.status(201).send({ message: "Usuário adicionado ao projeto com sucesso!", user : usuarioAdd });
    } catch (error) {
        res.status(500).send({ message: "Erro ao adicionar usuário ao projeto.", user: user });
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
    const  searchStatus  = req.query.searchStatus as Project['status'];
    const searchName = req.query.searchName as string;
    const searchCreator = req.query.searchCreator as string;
    const searchInst = req.query.searchInst as string;
    const searchSubj = req.query.searchSubj as string;
    const dateStart = req.query.dateStart as string;
    const dateFinish = req.query.dateFinish as string;

    try {
        const userInfo = await getUserInfo(req.cookies.token);
        if (userInfo.id === undefined) {
            res.status(400).send({ message: "User ID is missing." });
            return;
        }

        
        const result = await getProjectsService(userInfo,searchName,searchCreator,searchInst,searchSubj,dateStart ? new Date(dateStart) : undefined,dateFinish ? new Date(dateFinish) : undefined,searchStatus);
        res.status(200).send({ result }); 
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
        const creator = await getUserById(project!.creator!);
        res.status(200).send({ project, 'creator': creator });
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

export const createTaskController = async (req: Request, res: Response) => {// id do projeto no params e task no body
    const projectId = parseInt(req.params.id);
    const { task} = req.body;
    const user = await getUserInfo(req.cookies.token);

    if (!task || !projectId) {
        res.status(400).send({ message: "Dados da tarefa invalidos" });
        return;
    }

    try {
        const createdTask = await createTaskService(task, projectId,user.id);
        res.status(201).send({ message: "Tarefa criada com sucesso!", id: createdTask.id});
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar tarefa." });
        console.warn(error);
    }
}

export const addUserTaskController = async (req: Request, res: Response) => {//so o id da task e id do usuario
    const taskId = req.body.taskId;
    const taskUser = req.body.taskUser;
    if (!taskId || !taskUser) {
        res.status(400).send({ message: "Dados da tarefa invalidos" });
        return;
    }
    try{
        await addUserToTaskService(taskId, taskUser);
        res.status(201).send({ message: "Usuario adicionado a tarefa." });
    }catch(error){
        res.status(500).send({ message: "Erro ao adicionar usuario na tarefa." });
        console.warn(error);
    }
}

export const getTasksController= async (req: Request, res: Response) => {//apenas o id do projeto no params
    const projectId = parseInt(req.params.id);
    const {searchStatus,searchTaskUser,searchPriority,searchTitle,dateStart,dateFinish} = req.body;
    const User = await getUserInfo(req.cookies.token);
    if (isNaN(projectId)) {
        res.status(400).send({ message: "ID do projeto inválido." });
        return;
    }
    try {  
        const tasks = await getTasksService(projectId,User.id,searchStatus,searchTaskUser,searchPriority,searchTitle,dateStart,dateFinish);
        res.status(200).send(tasks);
    }catch (error) {
        res.status(500).send({ message: "Erro ao buscar tarefas." });
        console.warn(error);
    }
}

export const updateTaskController = async (req: Request, res: Response) => {//id do projeto no params e task no body
    const task = req.body.task;
    const projectId = parseInt(req.params.projectId);
    try {
        await updateTaskService(task, await getUserInfo(req.cookies.token),projectId);
        res.status(201).send({ message: "Tarefa atualizada com sucesso!" });
    }
    catch (error) {
        res.status(500).send({ message: "Erro ao atualizar tarefa." });
        console.warn(error);
    }
}

export const deleteTaskController   = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const user = await getUserInfo(req.cookies.token);
    if(!taskId){
        res.status(400).send({ message: "Dados da tarefa invalidos" });
        return;
    }

    try {
        await deleteTaskService(taskId, user.id);
        res.status(200).send({ message : "Tarefa deletada com sucesso!"});
    }catch (error){
        res.status(500).send({ message: "Erro ao deletar tarefa." });
        console.warn(error);
    }
}

export const getUserTaskController = async(req:Request, res:Response) => {
    const user = await getUserInfo(req.cookies.token);
    try {
        const tasks = await getUserTasks(user.id);
        res.status(200).send({tasks});
    }catch(error){
        res.status(500).send({ message: "Erro ao buscar tarefas do usuario." });
        console.warn(error);
    }

}
