type Project = {
  id: number;
  name: string;
  description: string;
  subject: string;
  institution: string;
  creator: number;
  status: "Fechado" | "Em_andamento" | "Concluido";
  start?: string;
  finish?: string;
};

export default Project;
