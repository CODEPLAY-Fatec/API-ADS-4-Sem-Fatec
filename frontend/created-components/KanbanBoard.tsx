import React, { useState, useEffect } from "react";
import Task from "@shared/Task";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import toast from "react-hot-toast";

type KanbanBoardProps = {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  projectId?: number;
  onTaskUpdate?: (updatedTask: Task) => void; 
};

export default function KanbanBoard({ tasks, onEditTask, projectId, onTaskUpdate }: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  const closedTasks = localTasks.filter(task => task.status === "Fechado");
  const inProgressTasks = localTasks.filter(task => task.status === "Em_andamento");
  const completedTasks = localTasks.filter(task => task.status === "Concluido");

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return date.toLocaleDateString('pt-BR', {timeZone: "UTC"});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fechado": return "bg-red-500";
      case "Em_andamento": return "bg-blue-500";
      case "Concluido": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;
    
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    let newStatus: string;
    switch (destination.droppableId) {
      case "fechado":
        newStatus = "Fechado";
        break;
      case "em-andamento":
        newStatus = "Em_andamento";
        break;
      case "concluido":
        newStatus = "Concluido";
        break;
      default:
        return;
    }

    let taskList: Task[];
    switch (source.droppableId) {
      case "fechado":
        taskList = closedTasks;
        break;
      case "em-andamento":
        taskList = inProgressTasks;
        break;
      case "concluido":
        taskList = completedTasks;
        break;
      default:
        return;
    }

    const draggedTask = taskList[source.index];
    const updatedTask = { ...draggedTask, status: newStatus };
    
    setLocalTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );

    try {
      console.log("Enviando atualização para:", `/api/projects/tasks/${projectId}`);

      const response = await axios.patch(`/api/projects/tasks/${projectId}`, {
        task: updatedTask,
      });
      
      if (response.status === 201 || response.status === 200) {
        toast.success(`Tarefa movida para ${newStatus.replace("_", " ")}`);
        
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
      }
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data || error);
      toast.error("Erro ao mover tarefa");
      setLocalTasks(tasks);
    }
  };

  const renderTaskCard = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id?.toString() || 'unknown'} index={index}>
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
      )}
    </Draggable>
  );

  const renderColumn = (title: string, tasks: Task[], status: string, droppableId: string) => (
    <div className="flex-1 mx-4">
      <div className="bg-gray-100 rounded-lg p-3 mb-2 flex items-center">
        <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} mr-2`}></div>
        <span className="font-medium text-gray-800">{title} ({tasks.length})</span>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-gray-50 p-3 h-[calc(100%-3rem)] overflow-y-auto rounded-lg"
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => renderTaskCard(task, index))
            ) : (
              <div className="text-center text-gray-400 mt-4">
                Nenhuma tarefa
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Kanban</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-[300px]">
            {renderColumn("Fechado", closedTasks, "Fechado", "fechado")}
            {renderColumn("Em Andamento", inProgressTasks, "Em_andamento", "em-andamento")}
            {renderColumn("Concluído", completedTasks, "Concluido", "concluido")}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
