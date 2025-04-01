import Project from "@shared/Project";
import { User } from "@shared/User";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const hasAccess = async (projectId: number, userId: number) => {
  return prisma.projects.findFirst({
    select: { id: true },
    where: { id: projectId, creator: userId }
  });
}

export const createProjectService = async (projectData: Project, user: User) => {

  const create = await prisma.projects.create({
    data: {
      name: projectData.name,
      description: projectData.description || null,
      subject: projectData.subject || null,
      status: projectData.status,//so aceita Em_andamento e Concluido sem acento
      institution: projectData.institution || null,
      creator: user.id!,
      start: projectData.start || new Date(),
      finish: projectData.finish || new Date(),
    }
  })
  return create;
};

export const updateProjectService = async (projectData: Project, user: User) => {
  const HasAcess = await hasAccess(projectData.id!, user.id!);
  if (!HasAcess) {
    throw new Error("Usuário não tem permissão para editar este projeto.");
  }

  const updatedProject = await prisma.projects.update({
    where: {
      id: projectData.id,
    },
    data: {
      name: projectData.name,
      description: projectData.description,
      subject: projectData.subject,
      status: projectData.status,
      institution: projectData.institution
    },
  });

  return updatedProject;
};

export const addUserToProjectService = async (projectId: number, userId: number, user: User) => {
  const HasAcess = await hasAccess(projectId, user.id!);
  if (!hasAccess) {
    throw new Error("Usuário não tem permissão para adicionar usuários a este projeto.");
  }
  const alredyIn = await prisma.projectmember.findFirst({
    where: {
      projectId: projectId,
      userId: userId
    }
  });
  if (alredyIn) {
    throw new Error("Usuário já está adicionado a este projeto.");
  }
  const addMember = await prisma.projectmember.create({
    data: {
      projectId: projectId,
      userId: userId
    }
  });
  return addMember;
}


export const removeUserFromProjectService = async (projectId: number, userId: number, user: User) => {
  const HasAcess = await hasAccess(projectId, user.id!);
  if (!HasAcess) {
    throw new Error("Usuário não tem permissão para remover usuários deste projeto.");
  }
  const removeMember = await prisma.projectmember.delete({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId
      }
    }
  });
  return removeMember;

}

export const getProjectsService = async (user: User) => {
  const projects = await prisma.projects.findMany({
    where: {
      OR: [
        { creator: user.id },
        {
          projectmember: {
            some: {
              userId: user.id
            }
          }
        }
      ]

    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
    }
  })
  return projects;
};

export const getProjectByIdService = async (projectId: number, user: User) => {
  const project = await prisma.projects.findUnique({
    where: {
      id: projectId
    },
    include: {
      projectmember: {
        select: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            }

          }
        }
      }

    }
  })
  return project;
};

export const getProjectSubjectsService = async () => {
  const projectSubjects = await prisma.projectsubjects.findMany({
    select: {
      name: true
    }
  })
  return projectSubjects;
};

export const getInstitutionsService = async () => {
  const institutions = prisma.institutions.findMany({
    select: {
      name: true
    }
  });
  return institutions
};

export const deleteProjectService = async (projectId: number, user: User) => {
  const HasAcess = await hasAccess(projectId, user.id!);
  if (!HasAcess) {
    throw new Error("Usuário não tem permissão para deletar este projeto.");
  };
  const deleteProject = await prisma.projects.delete({
    where: {
      id: projectId
    }
  });
};
