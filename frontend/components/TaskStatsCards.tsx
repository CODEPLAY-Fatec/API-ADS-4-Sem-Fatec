import Task from "@shared/Task";

interface TaskStatsCardsProps {
  tasks: Task[];
}

const TaskStatsCards = ({ tasks }: TaskStatsCardsProps) => {
  const now = new Date();

  const tasksConcluidas = tasks.filter((task) => {
    if (!task.finishedAt) return false;
    const diff = now.getTime() - new Date(task.finishedAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const tasksCriadas = tasks.filter((task) => {
    const diff = task.createdAt ? now.getTime() - new Date(task.createdAt).getTime() : Infinity;
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const tasksAEntregar = tasks.filter((task) => {
    if (!task.finishedAt) return false;
    const diff = new Date(task.finishedAt).getTime() - now.getTime();
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-green-600">
          {tasksConcluidas.length} concluído(s)
        </p>
        <p className="text-sm text-gray-500">nos últimos 7 dias</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-blue-600">
          {tasksCriadas.length} criado(s)
        </p>
        <p className="text-sm text-gray-500">nos últimos 7 dias</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-orange-500">
          {tasksAEntregar.length} a ser(em) entregue(s)
        </p>
        <p className="text-sm text-gray-500">nos próximos 7 dias</p>
      </div>
    </div>
  );
};

export default TaskStatsCards;
