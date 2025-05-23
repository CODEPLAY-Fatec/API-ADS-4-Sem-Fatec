import Project from "@shared/Project";
import { User } from "@shared/User";
import { PrismaClient } from "@prisma/client";
import Task from "@shared/Task";
import { sendAttributionEmail, sendProjectEmail, sendTaskUpdatedEmail } from "./mailService";

const prisma = new PrismaClient();

export const inTheProject = async (projectId: number, userId: number) => {
  const inProject = await prisma.projectMember.findFirst({
    where: {
      projectId: projectId,
      userId: userId!,
    },
  });
  const IsCreator = await prisma.projects.findFirst({
    where: {
      creator: userId!,
      id: projectId,
    },
  });
  return { inProject, IsCreator };
};

export const hasAccess = async (projectId: number, userId: number) => {
  return prisma.projects.findFirst({
    select: { id: true },
    where: { id: projectId, creator: userId },
  });
};

export const createProjectService = async (
  projectData: Project,
  user: User,
) => {
  const create = await prisma.projects.create({
    data: {
      name: projectData.name,
      description: projectData.description || null,
      subject: projectData.subject || null,
      status: projectData.status, // só aceita "Em_andamento" e "Concluido" sem acento
      institution: projectData.institution || null,
      creator: user.id!,
      start: projectData.start ? new Date(projectData.start) : new Date(),
      finish: projectData.finish ? new Date(projectData.finish) : new Date(),
    },
  });
  return create;
};

export const updateProjectService = async (
  projectData: Project,
  user: User,
) => {
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
      institution: projectData.institution,
      start: projectData.start ? new Date(projectData.start) : undefined,
      finish: projectData.finish ? new Date(projectData.finish) : undefined,
    },
  });

  return updatedProject;
};

export const addUserToProjectService = async (
  projectId: number,
  userId: number,
  user: User,
) => {
  const HasAccess = await hasAccess(projectId, user.id!);
  if (!HasAccess) {
    throw new Error(
      "Usuário não tem permissão para adicionar usuários a este projeto.",
    );
  }
  const alredyIn = await prisma.projectMember.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
    },
  });
  if (alredyIn) {
    throw new Error("Usuário já está adicionado a este projeto.");
  }
  const addMember = await prisma.projectMember.create({
    data: {
      projectId: projectId,
      userId: userId,
    },
  });

  const userInfo = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  sendProjectEmail({ ...userInfo!, password: ""}, true, await getProjectByIdService(projectId, user) as Project, user);

  return userInfo;
};

export const removeUserFromProjectService = async (
  projectId: number,
  userId: number,
  user: User,
) => {
  const HasAcess = await hasAccess(projectId, user.id!);
  if (!HasAcess) {
    throw new Error(
      "Usuário não tem permissão para remover usuários deste projeto.",
    );
  }
  const removeFromTasks = await prisma.tasks.updateMany({
    where: {
      projectId: projectId,
      taskUser: userId,
    },
    data: {
      taskUser: null,
    },
  });
  const removeMember = await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId,
      },
    },
  });

  const userInfo = await prisma.users.findUnique({
    where:{
      id: userId,
    },
    select:{
      id: true,
      name:true,
      email:true,
    }
  })
  sendProjectEmail({ ...userInfo!, password: ""}, false, await getProjectByIdService(projectId, user) as Project, user);

  return removeMember;
};

export const getProjectsService = async (
  user: User,
  searchName?: string,
  searchCreator?: string,
  searchInst?: string,
  searchSubj?: string,
  dateStart?: Date,
  dateFinish?: Date,
  searchStatus?: Project["status"],
) => {
  //essa parte toma conta de filtrar a parte do criador pois é um trabalho
  let creatorIds: { id: number }[] = []; //inicializa a array de ids para nao ficar preso dentro do escopo do if
  if (searchCreator) {
    creatorIds = await prisma.users.findMany({
      //pegando a lista de possiveis usuarios com o nome
      where: {
        name: { contains: searchCreator },
      },
      select: {
        id: true,
      },
    });
  }
  const idList = creatorIds.map((user) => user.id); //pegando a lista de ids de possiveis criadores e transformando em uma lista de ids

  //pegando os projetos e aplicandos os possiveis filtros
  const projects = await prisma.projects.findMany({
    where: {
      AND: [
        {
          OR: [
            { creator: user.id },
            {
              projectMember: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
        ...(searchName ? [{ name: { contains: searchName } }] : []), //fora do OR dentro do AND
        ...(searchCreator ? [{ creator: { in: idList } }] : []), //filtrar por criador
        ...(searchInst ? [{ institution: { contains: searchInst } }] : []), //filtrar por instuiçao
        ...(searchSubj ? [{ subject: { contains: searchSubj } }] : []), //filtrar por area de atuaçao
        ...(dateStart ? [{ start: { gt: dateStart } }] : []), // Para buscar registros depois da data
        ...(dateFinish ? [{ finish: { lt: dateFinish } }] : []), // Para buscar registros antes da data
        ...(searchStatus ? [{ status: searchStatus }] : []), //para buscar por status
      ],
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const formattedProjects = projects.map(({ users, ...rest }) => ({
    //um map somente para alternar os users retornados como creator
    ...rest,
    creatorInfo: users, // users agora se chama Creator
  }));

  return formattedProjects;
};

export const getProjectByIdService = async (projectId: number, user: User) => {
  if (!(await hasAccess(projectId, user.id))) {
    throw new Error("Usuário não tem permissão para acessar este projeto.");
  }
  const project = await prisma.projects.findUnique({
    where: {
      id: projectId,
    },
    include: {
      projectMember: {
        select: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    ...project,
    projectMember: project!.projectMember.map((member) => ({
      ...member.users,
    })),
  };
};

export const getProjectSubjectsService = async () => {
  const projectSubjects = await prisma.projectSubjects.findMany({
    select: {
      name: true,
    },
  });
  return projectSubjects;
};

export const getInstitutionsService = async () => {
  const institutions = prisma.institutions.findMany({
    select: {
      name: true,
    },
  });
  return institutions;
};

export const deleteProjectService = async (projectId: number, user: User) => {
  const HasAcess = await hasAccess(projectId, user.id!);
  if (!HasAcess) {
    throw new Error("Usuário não tem permissão para deletar este projeto.");
  }
  const deleteProject = await prisma.projects.delete({
    where: {
      id: projectId,
    },
  });
};

export const createTaskService = async (
  task: Task,
  projectId: number,
  userId: number,
) => {
  const IsMember = inTheProject(projectId, userId);
  if (!IsMember) {
    throw new Error(
      "Usuário não tem permissão para criar tarefas neste projeto.",
    );
  }
  const projectFinish = await prisma.projects.findFirst({  //essa parte gigante é para fazer as verificaçoes de data
    where: {
      id: projectId,
    },
    select: {
      finish: true,
    }
  });
  const ProjectFinish = new Date(projectFinish?.finish!);
  const TaskStart = new Date(task.start!);
  const TaskFinish = new Date(task.finish!);

  if (TaskFinish < TaskStart) {
    throw new Error("Data de início da tarefa não pode ser depois que a data de fim.");
  }
  if (TaskFinish > ProjectFinish) {
    throw new Error("Data de fim da tarefa não pode ser depois que a data de fim do projeto.");
  }
  if (ProjectFinish < TaskStart) {
    throw new Error("Data de início da tarefa não pode ser maior que a data de fim do projeto.");
  }

  const createTask = prisma.tasks.create({
    data: {
      title: task.title,
      description: task.description || null,
      start: task.start,
      finish: task.finish,
      finishedAt: task.status == "Concluido" ? new Date() : null,
      priority: task.priority,
      status: task.status,
      projectId: projectId,
      timeEstimate: task.timeEstimate || null,
      taskUser: task.taskUser || null,
    },
  });
  return createTask;
};

export const addUserToTaskService = async (taskId: number, userId: number) => {
  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    throw new Error("Problema ao encontrar id do projeto relacionado a task.");
  }

  const result = await prisma.tasks.findUnique({//arrumar
    where: {
      id: taskId,
    },
    select: {
      projectId: true,
    },
  });

  const IsMember = inTheProject(result!.projectId, userId);
  if (!IsMember) {
    throw new Error(
      "Usuário não tem permissão para criar tarefas neste projeto.",
    );
  }
  const addUserTask = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: {
      taskUser: userId || null,
    },
  });

  const userInfo = await prisma.users.findUnique({
    where:{
      id: userId,
    },
    select:{
      id: true,
      name:true,
      email:true,
    }
  })

  const project = await prisma.projects.findUnique({
    where:{
      id: result!.projectId,
    },
    select:{
      name:true,
    }
  })

  sendAttributionEmail({ ...userInfo!, password: ""}, project as Project, addUserTask as Task);

  return addUserTask;
};

export const getTasksService = async (
  projectId: number,
  userId: number,
  searchStatus?: Task["status"],
  searchTaskUser?: number,
  searchPriority?: Task["priority"],
  searchTitle?: string,
  dateStart?: Date,
  dateFinish?: Date,
) => {
  //verificaçao para ver se percente ao projeto
  const IsMember = await inTheProject(projectId, userId);
  if (!IsMember) {
    throw new Error(
      "Usuário não tem permissão para criar tarefas neste projeto.",
    );
  }

  //task vai pode ser filtrado por status,qm esta fazendo,prioridade,data fim e data inicio ,titulo

  const tasks = await prisma.tasks.findMany({
    where: {
      AND: [{ projectId: projectId }, //spread sendo usado para inserir os filtros na array do AND
      ...(searchStatus ? [{ status: searchStatus }] : []), //para buscar por status
      ...(searchPriority ? [{ priority: searchPriority }] : []), //para buscar por prioridade
      ...(searchTitle ? [{ title: { contains: searchTitle } }] : []), //para buscar por titulo
      ...(dateStart ? [{ start: { gt: dateStart } }] : []), //para buscar por data de inicio
      ...(dateFinish ? [{ finish: { lt: dateFinish } }] : []), //para buscar por data de fim
      ...(searchTaskUser ? [{ taskUser: searchTaskUser }] : []), //para buscar por usuario
      ],
    },
  });
  return tasks;
};

export const updateTaskService = async (
  task: Task,
  user: User,
  projectId: number,
) => {
  const IsMember = inTheProject(projectId, user.id!);
  if (!IsMember) {
    throw new Error(
      "Usuário não tem permissão para criar tarefas neste projeto.",
    );
  }
  const HasAccess = await hasAccess(projectId, user.id!);
  if (!HasAccess) {
    throw new Error("Usuário não tem permissão para editar esta tarefa.");
  }
  const projectFinish = await prisma.projects.findFirst({// essa parte gigante é para fazer as verificaçoes de data
    where: {
      id: projectId,
    },
    select: {
      finish: true,
    }
  });
  const ProjectFinish = new Date(projectFinish?.finish!);
  const TaskStart = new Date(task.start!);
  const TaskFinish = new Date(task.finish!);
  if (TaskFinish < TaskStart) {
    throw new Error("Data de início da tarefa não pode ser depois que a data de fim.");
  }
  if (TaskFinish > ProjectFinish) {
    throw new Error("Data de fim da tarefa nao pode ser depois que a data de fim do projeto.");
  }
  if (ProjectFinish < TaskStart) {
    throw new Error("Data de início da tarefa não pode ser maior que a data de fim do projeto.");
  }

  const oldTask = await prisma.tasks.findFirst({
    where: {
      id: task.id,
    },
  });
  let concluding = oldTask?.status !== "Concluido" && task.status === "Concluido" ? true : false; // para determinar se uma tarefa está sendo concluida
  let unconcluding = oldTask?.status === "Concluido" && task.status !== "Concluido" ? true : false; // caso contrário - se uma tarefa está deixando de ser concluída
  const updatedTask = await prisma.tasks.update({
    where: {
      id: task.id,
    },
    data: {
      title: task.title,
      description: task.description,
      start: task.start,
      finish: task.finish,
      priority: task.priority,
      status: task.status,
      timeEstimate: task.timeEstimate || null,
      finishedAt: concluding ? new Date() : unconcluding ? null : oldTask?.finishedAt,
    },
  });

  if (updatedTask.taskUser && oldTask?.taskUser == updatedTask.taskUser) { // notificar dono da tarefa (sem notificar na atribuição)
    const userInfo = await prisma.users.findUnique({
      where:{
        id: updatedTask.taskUser,
      },
      select:{
        id: true,
        name:true,
        email:true,
      }
    })

    const project = await prisma.projects.findUnique({
      where:{
        id: projectId,
      },
      select:{
        name:true,
      }
    })

    sendTaskUpdatedEmail({ ...userInfo!, password: ""}, project as Project, updatedTask as Task);
  }

  return updatedTask;
};

export const deleteTaskService = async (taskId: number, userId: number) => {
  //delete de task nao precisa ser o criador para deletar
  const task = await prisma.tasks.findFirst({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    throw new Error("Problema ao encontrar id do projeto relacionado a task.");
  }

  const result = await prisma.tasks.findUnique({//arrumar
    where: {
      id: taskId,
    },
    select: {
      projectId: true,
    },
  });

  const IsMember = inTheProject(result!.projectId, userId);
  if (!IsMember) {
    throw new Error(
      "Usuário não tem permissão para criar tarefas neste projeto.",
    );
  }

  const deleteTask = await prisma.tasks.delete({
    where: {
      id: taskId,
    },
  });
  return deleteTask;
};

export const getUserTasks = async (userId: number) => {
  const tasks = await prisma.tasks.findMany({
    where: {
      taskUser: userId
    },
    select: {
      id: true,
      title: true,
      finish: true,
      projects: {
        select: {
          name: true,
        }

      },
    }
  })

  const formatedTasks = tasks.map(({ projects, ...rest }) => ({
    ...rest,
    projectName: projects.name,
  }));
  return formatedTasks;
}
