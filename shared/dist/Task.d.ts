type Task = {
    taskUser: number;
    title: string;
    description?: string;
    start?: Date;
    finish?: Date;
    status: "Fechado" | "Em andamento" | "Concluído";
};
export default Task;
