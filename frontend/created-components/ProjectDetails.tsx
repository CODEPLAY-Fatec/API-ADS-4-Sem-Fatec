"use client";

import { useEffect, useState } from "react";
import TabNavigation from "@/created-components/TabNavigation";
import ProjectEditor from "@/created-components/ProjectEditor";
import { User } from "@shared/User";
import axios from "axios";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";
import Task from "@shared/Task";
import FetchedProject from "@/types/FetchedProject";
import DescriptionComponent from "./DescriptionComponent";
import TaskList from "./TaskList";
import toast from "react-hot-toast";
import KanbanBoard from "./KanbanBoard";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import GradientText from "./GradientText";
import TaskForm from "./TaskForm";

type ProjectDetailsProps = {
  projectId: number;
  closeSelectedProjectAction: () => void;
};

export default function ProjectDetails({
  projectId,
  closeSelectedProjectAction,
}: ProjectDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<FetchedProject | null>(
    null,
  );
  const [currentProjectCreator, setCurrentProjectCreator] =
    useState<User | null>(null);
  const [currentProjectTasks, setCurrentProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<TaskEvent[]>([]);
  const [currentTab, setCurrentTab] = useState("Descrição");
  
  // New state for task edit modal
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const projectResponse = await axios.get(`/api/projects/${projectId}`);
        const projectTasksResponse = await axios.get(
          `/api/projects/${projectId}/tasks`,
        );

        setCurrentProject(projectResponse.data.project);
        setCurrentProjectCreator(projectResponse.data.creator);
        setCurrentProjectTasks(
          projectTasksResponse.data.map((task: Task) => ({
            ...task,
            start: task.start ? new Date(task.start) : new Date(),
            finish: task.finish ? new Date(task.finish) : new Date(),
          })),
        );

        // Mapeando tarefas para eventos do calendário
        if (projectTasksResponse.data.tasks) {
          const events = projectTasksResponse.data.tasks.map((task: Task) => ({
            id: task.id,
            title: task.title,
            start: task.start ? new Date(task.start) : new Date(),
            end: task.finish ? new Date(task.finish) : new Date(),
            status: task.status.toLowerCase() as TaskEvent["status"],
          })) as TaskEvent[];
          setCalendarEvents(events);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [projectId]);

  const addTask = async (task: Task) => {
    if (currentProjectTasks.some((t) => t.id === task.id)) {
      try {
        const response = await axios.patch(`/api/projects/tasks/${currentProject?.id}`, {
          task: task,
        });
        if (response.status !== 201) {
          throw new Error("Erro ao atualizar tarefa");
        }
        setCurrentProjectTasks((prevTasks) => [
          ...prevTasks.filter((t) => t.id !== task.id),
          {
            ...task,
          },
        ]);
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        toast.error("Erro ao atualizar tarefa");
      }
    } else {
      try {
        const response = await axios.post(`api/projects/${projectId}/tasks`, {
          task: task,
        });

        if (response.status !== 201) {
          throw new Error("Erro ao adicionar tarefa");
        }
        setCurrentProjectTasks((prevTasks) => [
          ...prevTasks,
          {
            ...task,
            id: response.data.id,
          },
        ]);
        toast.success("Tarefa criada com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        toast.error("Erro ao adicionar tarefa");
      }
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      const response = await axios.delete(`api/projects/tasks/${task.id}`);
      if (response.status !== 200) {
        throw new Error("Erro ao deletar tarefa");
      }
      toast.success("Tarefa deletada com sucesso!");
      setCurrentProjectTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id),
      );
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentEditingTask(task);
    setShowTaskForm(true);
  };

  const handleNewTask = () => {
    setCurrentEditingTask(null);
    setShowTaskForm(true);
  };

  if (loading) return <div>Carregando...</div>;

  if (!currentProject || !currentProjectCreator) {
    return <div>Falha ao carregar detalhes do projeto.</div>;
  }

  return (
    <div className="flex flex-col relative">
      {showTaskForm && (
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
            <TaskForm
              task={currentEditingTask}
              toggleForm={() => {
                setShowTaskForm(false);
                setCurrentEditingTask(null);
              }}
              addTask={addTask}
              deleteTask={deleteTask}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col px-4 py-2">
        <div className="w-full max-w-7xl mx-auto">
          <div className="p-4 max-w-4xl mx-auto relative">
            <button
              onClick={() => {
                console.log("Redirecionando para /projetos");
                //router.push("/projetos");
                closeSelectedProjectAction();
              }}
              className="absolute top-4 left-8 text-3xl text-gray-700 hover:text-gray-900"
            >
              &#60;
            </button>
            <h1 className="text-blue-600 text-2xl font-semibold text-center mt-2">
              {currentProject.name}
            </h1>
            <button
              onClick={() => setEditing(true)}
              className="absolute top-4 right-8 bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition duration-200 text-sm"
            >
              Editar
            </button>
          </div>

          <TabNavigation onTabChange={(tab) => setCurrentTab(tab)} />

          {/* Conteúdo da aba selecionada */}
          <div className="mt-4">
            {currentTab === "Descrição" && (
              <DescriptionComponent
                currentProject={currentProject}
                currentProjectCreator={currentProjectCreator}
              />
            )}
            {currentTab === "Kanban" && (
              <KanbanBoard 
                tasks={currentProjectTasks} 
                onEditTask={handleEditTask}
              />
            )}
            {currentTab === "Relatórios" && (
              <div className="border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">Relatórios</h2>
                  <div className="h-[300px] overflow-y-auto">
                    <div className="scale-[0.6] origin-top-left">
                      <TaskCalendar events={calendarEvents} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentTab === "Tarefas" && (
              <TaskList
                currentTasks={currentProjectTasks}
                addTask={addTask}
                deleteTask={deleteTask}
                onEditTask={handleEditTask}
                onNewTask={handleNewTask}
                tasks={currentProjectTasks}
                setTasks={(tasks: Task[]): void => {
                  setCurrentProjectTasks(tasks);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center">
          <ProjectEditor
            project={currentProject}
            setCurrentProject={(project) => {
              setCurrentProject(project);
            }}
            onClose={(deleted: boolean) => {
              setEditing(false); 
              if (deleted) {
                closeSelectedProjectAction();
              }
            }}
            users={currentProject.projectMember}
            creator={currentProjectCreator}
          />
        </div>
      )}
    </div>
  );
}
