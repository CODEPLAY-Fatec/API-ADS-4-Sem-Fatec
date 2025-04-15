import React from "react";
import Task from "@shared/Task";

type KanbanBoardProps = {
  tasks: Task[];
  onEditTask: (task: Task) => void;
};

export default function KanbanBoard({ tasks, onEditTask }: KanbanBoardProps) {
  const closedTasks = tasks.filter(task => task.status === "Fechado");
  const inProgressTasks = tasks.filter(task => task.status === "Em_andamento");
  const completedTasks = tasks.filter(task => task.status === "Concluido");

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fechado": return "bg-red-500";
      case "Em_andamento": return "bg-blue-500";
      case "Concluido": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const renderTaskCard = (task: Task) => (
    <div 
      key={task.id}
      onClick={() => onEditTask(task)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow w-full"
    >
      <h3 className="font-semibold text-blue-600 mb-2 break-words">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-3 break-words line-clamp-2">{task.description}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <div>
          <span className="font-medium">Início:</span> {formatDate(task.start)}
        </div>
        <div>
          <span className="font-medium">Fim:</span> {formatDate(task.finish)}
        </div>
      </div>
    </div>
  );

  const renderColumn = (title: string, tasks: Task[], status: string) => (
    <div className="flex-1 mx-4">
      <div className="bg-gray-100 rounded-lg p-3 mb-2 flex items-center">
        <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} mr-2`}></div>
        <span className="font-medium text-gray-800">{title} ({tasks.length})</span>
      </div>
      <div className="bg-gray-50 p-3 h-[calc(100%-3rem)] overflow-y-auto rounded-lg">
        {tasks.length > 0 ? (
          tasks.map(renderTaskCard)
        ) : (
          <div className="text-center text-gray-400 mt-4">
            Nenhuma tarefa
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Kanban</h2>
        <div className="flex h-[300px]">
          {renderColumn("Fechado", closedTasks, "Fechado")}
          {renderColumn("Em Andamento", inProgressTasks, "Em_andamento")}
          {renderColumn("Concluído", completedTasks, "Concluido")}
        </div>
      </div>
    </div>
  );
}

