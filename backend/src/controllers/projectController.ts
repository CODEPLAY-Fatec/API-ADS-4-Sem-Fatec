import { Request, Response } from "express";
import Project from "@shared/Project";
import {
  createProjectService,
  getProjectsService,
  getProjectSubjectsService,
} from "../services/projectService";

export const createProjectController = async (req: Request, res: Response) => {
  const ProjectData: Project = req.body;
  console.log(ProjectData);

  // TODO: pegar o ID do usuário logado, e colocar como project.creator
  try {
    await createProjectService(ProjectData);
    res.status(201).send({ message: "Projeto criado com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: "Erro ao criar projeto." });
    console.warn(error);
  }
};

export const getProjectsController = async (req: Request, res: Response) => {
  try {
    // TODO: pegar o id do usuário logado
    // como?
    // cu kis
    // por enquanto só vai pegar todos os projetos mesmo.
    const result = await getProjectsService(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar projetos." });
  }
};

export const getProjectSubjectsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getProjectSubjectsService(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar projetos." });
  }
};
