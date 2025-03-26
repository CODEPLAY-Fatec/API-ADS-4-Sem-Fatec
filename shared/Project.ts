type Project = {
  id: number;
  name: string;
  description?: string;
  subject?: string;
  institution?: string;
  creator: number;
  status: "Fechado" | "Em_andamento"|"Concluido"
};

export default Project;
