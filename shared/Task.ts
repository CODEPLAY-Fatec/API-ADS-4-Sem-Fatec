type Task = {
  taskUser: number;
  title: string;
  description?: string;
  start?: Date;
  finish?: Date;
  priority?: "Baixa" | "Média" | "Alta";
  status: "Fechado" | "Em andamento" | "Concluído";
};

export default Task;
