import { userPicture } from "@prisma/client";
import Project from "@shared/Project";
import Task from "@shared/Task";
import { User } from "@shared/User";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "quantum.gestaoproj@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});
// notificações:
// adicionado/removido de projeto
// tarefa atribuida
// tarefa atribuida atualizada (inclui remoção de atribuição)
// notificações exclusivas pra criador do projeto?

export const sendProjectEmail = async (
  user: User,
  state: boolean,
  project: Project,
  projectCreator: User,
) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <p>Prezado(a) ${user.name},</p>
      <p>Você foi ${state ? "adicionado(a) a" : "removido(a) de"} um projeto no Quantum Enterprise.</p>
      <h3>Informações do Projeto:</h3>
      <ul>
        <li><strong>Nome do Projeto:</strong> ${project.name}</li>
        <li><strong>Criador:</strong> ${projectCreator.name || "N/A"}</li>
        <li><strong>Email do Criador:</strong> ${projectCreator.email || "N/A"}</li>
        <li><strong>Instituição:</strong> ${project.institution || "N/A"}</li>
      </ul>
      <p>Se você tiver dúvidas ou não reconhecer esta ação, entre em contato com o administrador do sistema.</p>
      <br>
      <p>Atenciosamente,</p>
      <p><strong>Quantum Enterprise</strong></p>
      </div>
    `;

  await transporter.sendMail({
    from: '"Quantum Enterprise" <quantum.gestaoproj@gmail.com>',
    to: user.email,
    subject: `${state ? "Adicionado a" : "Removido de"} um projeto`,
    html: htmlContent,
  });
};

export const sendAttributionEmail = async (
  user: User,
  project: Project,
  task: Task,
) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <p>Prezado(a) ${user.name},</p>
      <p>Você foi atribuído a uma nova tarefa no projeto ${project.name}.</p>
      <h3>Informações da Tarefa:</h3>
      <ul>
        <li><strong>Nome da Tarefa:</strong> ${task.title}</li>
        <li><strong>Descrição:</strong> ${task.description || "N/A"}</li>
        <li><strong>Status:</strong> ${task.status || "N/A"}</li>
        <li><strong>Data de Entrega:</strong> ${task.finish || "N/A"}</li>
      </ul>
      <p>Se você tiver dúvidas ou não reconhecer esta ação, entre em contato com o administrador do sistema.</p>
      <br>
      <p>Atenciosamente,</p>
      <p><strong>Quantum Enterprise</strong></p>
      </div>
    `;

  await transporter.sendMail({
    from: '"Quantum Enterprise" <quantum.gestaoproj@gmail.com>',
    to: user.email,
    subject: `Atribuição de Tarefa no Projeto ${project.name}`,
    html: htmlContent,
  });
};

export const sendTaskUpdatedEmail = async (
  user: User,
  project: Project,
  task: Task,
) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <p>Prezado(a) ${user.name},</p>
      <p>Uma tarefa que você está atribuído foi atualizada no projeto ${project.name}.</p>
      <h3>Informações da Tarefa:</h3>
      <ul>
        <li><strong>Nome da Tarefa:</strong> ${task.title}</li>
        <li><strong>Descrição:</strong> ${task.description || "N/A"}</li>
        <li><strong>Status:</strong> ${task.status || "N/A"}</li>
        <li><strong>Data de Entrega:</strong> ${task.finish || "N/A"}</li>
      </ul>
      <p>Se você tiver dúvidas ou não reconhecer esta ação, entre em contato com o administrador do sistema.</p>
      <br>
      <p>Atenciosamente,</p>
      <p><strong>Quantum Enterprise</strong></p>
      </div>
    `;

  await transporter.sendMail({
    from: '"Quantum Enterprise" <quantum.gestaoproj@gmail.com>',
    to: user.email,
    subject: `Atualização de Tarefa no Projeto ${project.name}`,
    html: htmlContent,
  });
};
