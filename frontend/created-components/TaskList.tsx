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
  onEditTask,
  onNewTask
}: TaskListProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    start: "",
    finish: "",
  });

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

  const filteredTasks = currentTasks.filter((task) => {
    const matchName = task.title
      .toLowerCase()
      .includes(filters.name.toLowerCase());

    const matchStatus = filters.status ? task.status === filters.status : true;



    return matchName && matchStatus
  });



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
                setShowTaskForm(false);
                setCurrentEditingTask(null);
              }}
              className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
            >
              <XIcon size={20} />
            </Button>
            <div className="flex justify-center mb-4 items-center">
              <GradientText>{currentEditingTask ? "Editar Tarefa" : "Nova Tarefa"}</GradientText>
            </div>
            {/* 
            <TaskForm
              task={currentEditingTask}
              toggleForm={() => {
                setShowTaskForm(false);
                setCurrentEditingTask(null);
              }}
              addTask={addTask}
              deleteTask={deleteTask}
            />
            */}
          </div>
        </div>
      )}

      <div className="border rounded-lg shadow-sm overflow-hidden h-[55vh] flex flex-col">
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista de Tarefas</h2>
            <button
              onClick={handleNewTask}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Nova tarefa
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mb-4 items-end">
            <input
              type="text"
              placeholder="Filtrar por nome"
              className="flex-grow border p-2 rounded"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />

            <select
              className="border p-2 rounded"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos os status</option>
              <option value="Fechado">Fechado</option>
              <option value="Em_andamento">Em andamento</option>
              <option value="Concluido">Concluído</option>
            </select>

            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
              onClick={() => setFilters({ name: "", status: "", start: "", finish: "" })}
            >
              Limpar filtros
            </button>
          </div>



          <div className="overflow-hidden flex-1">
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
                  {filteredTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => editTask(task)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <TableCell className="text-center text-blue-500">
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
                        {task.start?.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </TableCell>
                      <TableCell className="text-center">
                        {task.finish?.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
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
