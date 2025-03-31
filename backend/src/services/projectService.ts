import Project from "@shared/Project";
import { User } from "@shared/User";
import { db } from "../config/database";

export const createProjectService = async (
  projectData: Project,
  user: User,
) => {
  const query =
    "INSERT INTO projects (name, description, subject, creator, status, institution) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    projectData.name,
    projectData.description || null,
    projectData.subject || null,
    user.id,
    projectData.status || null,
    projectData.institution || null,
  ];

  return db.query(query, values);
};

export const updateProjectService = async (
  projectData: Project,
  user: User,
) => {
  const hasAccess = await db.typedQuery<{ id: number }>(
    "SELECT id FROM projects WHERE id = ? AND creator = ?",
    [projectData.id, user.id],
  );
  if (!hasAccess.length) {
    throw new Error("Usuário não tem permissão para editar este projeto.");
  }
  const query =
    "UPDATE projects SET name = ?, description = ?, subject = ?, status = ?, institution = ? WHERE id = ?";
  const values = [
    projectData.name || null,
    projectData.description || null,
    projectData.subject || null,
    projectData.status || null,
    projectData.institution || null,
    projectData.id,
  ];
  return db.query(query, values);
};

export const addUserToProjectService = async (
  projectId: number,
  userId: number,
  user: User,
) => {
  const hasAccess = await db.typedQuery<{ id: number }>(
    "SELECT id FROM projects WHERE id = ? AND creator = ?",
    [projectId, user.id],
  );
  const alreadyInProject = await db.typedQuery<{ id: number }>(
    "SELECT projectId FROM projectMember WHERE projectId = ? AND userId = ?",
    [projectId, userId],
  );
  if (!hasAccess.length) {
    throw new Error(
      "Usuário não tem permissão para adicionar usuários a este projeto.",
    );
  }
  if (alreadyInProject.length) {
    throw new Error("Usuário já está no projeto.");
  }
  const query = "INSERT INTO projectMember (projectId, userId) VALUES (?, ?)";
  return db.query(query, [projectId, userId]);
};

export const removeUserFromProjectService = async (
  projectId: number,
  userId: number,
  user: User,
) => {
  const hasAccess = await db.typedQuery<{ id: number }>(
    "SELECT id FROM projects WHERE id = ? AND creator = ?",
    [projectId, user.id],
  );
  if (!hasAccess.length) {
    throw new Error(
      "Usuário não tem permissão para remover usuários deste projeto.",
    );
  }
  const query = "DELETE FROM projectMember WHERE projectId = ? AND userId = ?";
  return db.query(query, [projectId, userId]);
};

export const getProjectsService = async (user: User) => {
  const query = `
    SELECT 
      p.*, 
      COALESCE(GROUP_CONCAT(u.id), '') AS member_ids,
      COALESCE(GROUP_CONCAT(u.name), '') AS member_names,
      COALESCE(GROUP_CONCAT(u.email), '') AS member_emails 
    FROM projects p
    LEFT JOIN projectMember pm ON p.id = pm.projectId
    LEFT JOIN users u ON pm.userId = u.id
    WHERE 
      p.creator = ? 
      OR p.id IN (SELECT projectId FROM projectMember WHERE userId = ?)
    GROUP BY p.id;`; // jesus que query horrorosa.
  const values = [user.id, user.id];
  const projects = (
    await db.typedQuery<
      Project & {
        member_ids: string;
        member_names: string;
        member_emails: string;
      }
    >(query, values)
  ).map((project) => ({
    ...project,
    member_ids: project.member_ids.split(",").filter(Boolean).map(Number),
    member_names: project.member_names.split(",").filter(Boolean),
    member_emails: project.member_emails.split(",").filter(Boolean),
  }));
  return projects;
};

export const getProjectByIdService = async (projectId: number, user: User) => {
  const query = `
    SELECT 
      p.*, 
      COALESCE(GROUP_CONCAT(u.id), '') AS member_ids,
      COALESCE(GROUP_CONCAT(u.name), '') AS member_names,
      COALESCE(GROUP_CONCAT(u.email), '') AS member_emails 
    FROM projects p
    LEFT JOIN projectMember pm ON p.id = pm.projectId
    LEFT JOIN users u ON pm.userId = u.id
    WHERE 
      p.id = ? AND (p.creator = ? OR p.id IN (SELECT projectId FROM projectMember WHERE userId = ?))
    GROUP BY p.id;`;
  const values = [projectId, user.id, user.id];
  const projects = (
    await db.typedQuery<
      Project & {
        member_ids: string;
        member_names: string;
        member_emails: string;
      }
    >(query, values)
  ).map((project) => ({
    ...project,
    member_ids: project.member_ids.split(",").filter(Boolean).map(Number),
    member_names: project.member_names.split(",").filter(Boolean),
    member_emails: project.member_emails.split(",").filter(Boolean),
  }));
  return projects[0];
};

export const getProjectSubjectsService = async () => {
  const query = "SELECT name from projectSubjects";
  return db.typedQuery<string>(query);
};

export const getInstitutionsService = async () => {
  const query = "SELECT name FROM institutions";
  return db.typedQuery<string>(query);
};

export const deleteProjectService = async (projectId: number, user: User) => {
  const hasAccess = await db.typedQuery<{ id: number }>(
    "SELECT id FROM projects WHERE id = ? AND creator = ?",
    [projectId, user.id],
  );
  if (!hasAccess.length) {
    throw new Error("Usuário não tem permissão para deletar este projeto.");
  }
  const query = "DELETE FROM projects WHERE id = ?";
  return db.query(query, [projectId]);
};
