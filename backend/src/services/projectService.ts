import Project from "@shared/Project";
import { User } from "@shared/User";
import { db } from "../config/database";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createProjectService = async (projectData: Project, user: User) => {
    const query = "INSERT INTO projects (name, description, subject, creator, status, institution) VALUES (?, ?, ?, ?, ?, ?)";
    
    return prisma.project.create({
        data:{
            name: projectData.name,
            description: projectData.description || null,
            subject: projectData.subject || null,
            status: projectData.status || "Em_Andamento",
            institution: projectData.institution || null,
            creatorId: user.id
        }
    })
};

export const updateProjectService = async (projectData: Project, user: User) => {
    const hasAccess = await db.typedQuery<{ id: number }>("SELECT id FROM projects WHERE id = ? AND creator = ?", [projectData.id, user.id]);
    if (!hasAccess.length) {
        throw new Error("Usuário não tem permissão para editar este projeto.");
    }
    const query = "UPDATE projects SET name = ?, description = ?, subject = ?, status = ?, institution = ? WHERE id = ?";
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

export const addUserToProjectService = async (projectId: number, userId: number, user: User) => {
    const hasAccess = await db.typedQuery<{ id: number }>("SELECT id FROM projects WHERE id = ? AND creator = ?", [projectId, user.id]);
    if (!hasAccess.length) {
        throw new Error("Usuário não tem permissão para adicionar usuários a este projeto.");
    }
    const query = "INSERT INTO projectMember (projectId, userId) VALUES (?, ?)";
    return db.query(query, [projectId, userId]);
}

export const removeUserFromProjectService = async (projectId: number, userId: number, user: User) => {
    const hasAccess = await db.typedQuery<{ id: number }>("SELECT id FROM projects WHERE id = ? AND creator = ?", [projectId, user.id]);
    if (!hasAccess.length) {
        throw new Error("Usuário não tem permissão para remover usuários deste projeto.");
    }
    const query = "DELETE FROM projectMember WHERE projectId = ? AND userId = ?";
    return db.query(query, [projectId, userId]);
}

export const getProjectsService = async (user: User) => {
    console.log(user);
    const query = "SELECT * FROM projects WHERE creator = ? OR id IN (SELECT projectId FROM projectMember WHERE userId = ?)";
    const values = [user.id, user.id];

    return db.typedQuery<Project>(query, values);
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
    const hasAccess = await db.typedQuery<{ id: number }>("SELECT id FROM projects WHERE id = ? AND creator = ?", [projectId, user.id]);
    if (!hasAccess.length) {
        throw new Error("Usuário não tem permissão para deletar este projeto.");
    }
    const query = "DELETE FROM projects WHERE id = ?";
    return db.query(query, [projectId]);
};
