type Task = {
  id?: number;
  taskUser: number;
  title: string;
  description?: string;
  start?: Date;
  finish?: Date;
  priority?: "Baixa" | "Media" | "Alta";
  status: "Fechado" | "Em_andamento" | "Concluido";
  timeEstimate?: number;
};

export default Task;
