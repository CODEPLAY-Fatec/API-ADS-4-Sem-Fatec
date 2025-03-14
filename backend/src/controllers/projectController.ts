import { Request, Response } from "express";
import Project from "@shared/Project";
import {
  createProjectService,
  getInstitutionsService,
  getProjectsService,
  getProjectSubjectsService,
} from "../services/projectService";
import { getUserInfo } from "../services/userService";

export const createProjectController = async (req: Request, res: Response) => {
  const ProjectData: Project = req.body;
  console.log(ProjectData);

  // TODO: pegar o ID do usuário logado, e colocar como project.creator
  if (!ProjectData.name) {
    res.status(400).send({ message: "Nome do projeto é obrigatório." });
    return;
  }
  try {
    await createProjectService(
      ProjectData,
      await getUserInfo(req.cookies.token),
    );
    res.status(201).send({ message: "Projeto criado com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: "Erro ao criar projeto." });
    console.warn(error);
  }
};

export const getProjectsController = async (req: Request, res: Response) => {
  try {
    const result = await getProjectsService(
      req.body,
      await getUserInfo(req.cookies.token),
    );
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

export const getInstitutionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getInstitutionsService();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar instituições." });
  }
};
