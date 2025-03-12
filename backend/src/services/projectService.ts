import Project from "@shared/Project";
import { db } from "../config/database";

export const createProjectService = async (projectData: Project) => {
  const query =
    "INSERT INTO projects (name, description, subject, creator, status, institution) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    projectData.name,
    projectData.description || null,
    projectData.subject || null,
    projectData.creator,
    projectData.status || null,
    projectData.institution || null,
  ];
  console.log(values);

  return db.query(query, values);
};

export const getProjectsService = async (creatorId: number) => {
  const query = "SELECT * FROM projects"; // WHERE creator = ?";
  //const values = [projectData.creator];
  return db.typedQuery<Project>(query);
};

export const getProjectSubjectsService = async (creatorId: number) => {
  const query = "SELECT name from projectSubjects";
  return db.typedQuery<string>(query);
};

export const getInstitutionsService = async () => {
  const query = "SELECT name FROM institutions";
  return db.typedQuery<string>(query);
};
