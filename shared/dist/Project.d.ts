type Project = {
    name: string;
    description?: string;
    subject?: string;
    creator: number;
    status?: "Fechado" | "Em andamento" | "Concluído";
};
export default Project;
