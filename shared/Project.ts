type Project = {
  id: number;
  name: string;
  description: string;
  subject: string;
  institution: string;
  creator: number;
  status: "Fechado" | "Em andamento" | "Concluído";
};

export default Project;
