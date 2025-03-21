import Project from "@shared/Project";
import { User } from "@shared/User";
import { db } from "../config/database";

export const createProjectService = async (projectData: Project, user: User) => {
    const query = "INSERT INTO projects (name, description, subject, creator, status, institution) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        projectData.name,
        projectData.description || null,
        projectData.subject || null,
        user.id,
        projectData.status || null,
        projectData.institution || null,
    ];
    console.log(values);

    return db.query(query, values);
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

export const getProjectsService = async (user: User) => {
    const query = "SELECT * FROM projects WHERE creator = ?";
    const values = [user.id];
    return db.typedQuery<Project>(query, values); // Certifique-se de passar os valores corretamente
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
