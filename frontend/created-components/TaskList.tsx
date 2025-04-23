import Task from "@shared/Task";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskForm from "./TaskForm";
import GradientText from "./GradientText";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

type TaskListProps = {
  currentTasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  onEditTask?: (task: Task) => void; 
  onNewTask?: () => void; 
  tasks?: Task[]; 
  setTasks?: (tasks: Task[]) => void; 
};

export default function TaskList({ 
  currentTasks, 
  addTask, 
  deleteTask, 
  onEditTask, 
  onNewTask 
}: TaskListProps) {
  const [showTaskForm, setShowTaskForm] = useState<true | false>(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(null);

  const editTask = (task: Task) => {
    if (onEditTask) {
      onEditTask(task);
    } else {
      setCurrentEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleNewTask = () => {
    if (onNewTask) {
      onNewTask();
    } else {
      setCurrentEditingTask(null);
      setShowTaskForm(true);
    }
  };

  return (
    <>
      {!onEditTask && showTaskForm && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Form"
              onClick={() => {
                setShowTaskForm(!showTaskForm);
                setCurrentEditingTask(null);
              }}
              className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
            >
              <XIcon size={20} />
            </Button>
            <div className="flex justify-center mb-4 items-center">
              <GradientText>{currentEditingTask ? "Editar Tarefa" : "Nova Tarefa"}</GradientText>
            </div>
            <TaskForm
              task={currentEditingTask}
              toggleForm={() => {
                setShowTaskForm(!showTaskForm);
                setCurrentEditingTask(null);
              }}
              addTask={addTask}
              deleteTask={deleteTask}
            />
          </div>
        </div>
      )}

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista de Tarefas</h2>
            <button
              onClick={handleNewTask}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Nova tarefa
            </button>
          </div>
          
          <div className="h-[300px] overflow-hidden">
            <div className="h-full overflow-y-auto border rounded">
              <Table className="table-fixed">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="h-11 text-center">Nome</TableHead>
                    <TableHead className="h-11 text-center">Status</TableHead>
                    <TableHead className="h-11 text-center">Início</TableHead>
                    <TableHead className="h-11 text-center">Fim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => {
                        editTask(task);
                      }}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <TableCell className="text-center cursor-pointer text-blue-500">
                        {task.title}
                      </TableCell>
                      <TableCell className="text-center">
                        {task.status === "Em_andamento" 
                          ? "Em andamento" 
                          : task.status === "Concluido" 
                            ? "Concluído" 
                            : task.status}
                      </TableCell>
                      <TableCell className="text-center">
                        {task.start?.toLocaleDateString('pt-BR', {timeZone: "UTC"})}
                      </TableCell>
                      <TableCell className="text-center">
                        {task.finish?.toLocaleDateString('pt-BR', {timeZone: "UTC"})}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
