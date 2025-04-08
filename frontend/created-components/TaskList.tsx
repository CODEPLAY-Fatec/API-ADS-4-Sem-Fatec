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

type TaskListProps = {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
};
export default function TaskList({ tasks, setTasks: setTasks }: TaskListProps) {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const [showTaskForm, setShowTaskForm] = useState<true | false>(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(
    null,
  );

  const editTask = (task: Task) => {
    setCurrentEditingTask(task);
    setShowTaskForm(true);
  };

  return (
    <>
      {showTaskForm ? (
        <>
          <TaskForm
            task={currentEditingTask}
            toggleForm={() => {
              setShowTaskForm(!showTaskForm);
              setCurrentEditingTask(null);
            }}
            addTask={(task: Task) => {
              if (currentEditingTask) {
                const updatedTasks = currentTasks.map((t) =>
                  t.id === task.id ? task : t,
                );
                setCurrentTasks(updatedTasks);
                setTasks(updatedTasks);
              } else {
                const newTask = { ...task, id: Date.now() };
                setCurrentTasks([...currentTasks, newTask]);
                setTasks([...currentTasks, newTask]);
              }
            }}
            removeTask={function (task: Task): void {
              const updatedTasks = currentTasks.filter((t) => t.id !== task.id);
              setCurrentTasks(updatedTasks);
              setTasks(updatedTasks);
            }}
          />
        </>
      ) : (
        <div>
          <button
            onClick={() => {
              setCurrentEditingTask(null);
              setShowTaskForm(!showTaskForm);
            }}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Nova tarefa
          </button>
          <h1 className="text-2xl font-bold">Lista de Tarefas</h1>
          <Table className="table-fixed">
            <TableHeader>
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
                >
                  <TableCell className="text-center cursor-pointer text-blue-500">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-center">{task.status}</TableCell>
                  <TableCell className="text-center">
                    {task.start?.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {task.finish?.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
