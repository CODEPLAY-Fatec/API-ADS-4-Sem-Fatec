"use client";

import { TaskEvent } from "@/components/TaskCalendar";
import { Button } from "@/components/ui/button";
import ProjectEditor from "@/created-components/ProjectEditor";
import TabNavigation from "@/created-components/TabNavigation";
import FetchedProject from "@/types/FetchedProject";
import Task from "@shared/Task";
import { User } from "@shared/User";
import axios from "axios";
import { Settings, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DescriptionComponent from "./DescriptionComponent";
import GradientText from "./GradientText";
import KanbanBoard from "./KanbanBoard";
import Report from "./Report";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

type ProjectDetailsProps = {
    projectId: number;
    closeSelectedProjectAction: () => void;
};

export default function ProjectDetails({ projectId, closeSelectedProjectAction }: ProjectDetailsProps) {
    const [editing, setEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<FetchedProject | null>(null);
    const [currentProjectCreator, setCurrentProjectCreator] = useState<User | null>(null);
    const [currentProjectTasks, setCurrentProjectTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarEvents, setCalendarEvents] = useState<TaskEvent[]>([]);
    const [currentTab, setCurrentTab] = useState("Descrição");
    const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0);

    const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
    const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(null);

    const [projectMembers, setProjectMembers] = useState<User[]>([]);

    const taskFormRef = useRef<HTMLDivElement>(null);
    const projectEditorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProjectDetails() {
            try {
                const projectResponse = await axios.get(`/api/projects/${projectId}`);
                const projectTasksResponse = await axios.get(`/api/projects/${projectId}/tasks`);

                setCurrentProject(projectResponse.data.project);
                setCurrentProjectCreator(projectResponse.data.creator);
                setProjectMembers(projectResponse.data.project.projectMember); // <-- Adicione isso
                const tasks = projectTasksResponse.data.map((task: Task) => ({
                    ...task,
                    start: task.start ? new Date(task.start) : new Date(),
                    finish: task.finish ? new Date(task.finish) : new Date(),
                }));
                setCurrentProjectTasks(tasks);

                const events = tasks.map((task: Task) => ({
                    id: task.id,
                    title: task.title,
                    start: task.start ? new Date(task.start) : new Date(),
                    end: task.finish ? new Date(task.finish) : new Date(),
                    status: task.status?.toLowerCase() as TaskEvent["status"],
                }));
                setCalendarEvents(events);
            } catch (error) {
                console.error("Erro ao buscar detalhes do projeto:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjectDetails();
    }, [projectId, taskUpdateTrigger]);

  useEffect(() => {
    const updatedEvents = currentProjectTasks.map((task) => ({
      id: task.id || Date.now(), // Garante que sempre terá um valor
      title: task.title,
      start: task.start ? new Date(task.start) : new Date(),
      end: task.finish ? new Date(task.finish) : new Date(),
      status: task.status?.toLowerCase() as TaskEvent["status"],
    }));
    setCalendarEvents(updatedEvents);
  }, [currentProjectTasks]);

  const addTask = async (task: Task) => {
    if (currentProjectTasks.some((t) => t.id === task.id)) {
      try {

        if (task.start && currentProject?.finish && task.finish) {
          if (new Date(task.start) > new Date(currentProject.finish)) {
            toast.error("Data de início da tarefa não pode ser depois da data de término do projeto.", { duration: 3000 });
            return;
          } else if (new Date(task.finish) > new Date(currentProject.finish)) {
            toast.error("Data de término da tarefa não pode ser depois da data de término do projeto.", { duration: 3000 });
            return;
          } else if (new Date(task.start) > new Date(task.finish)) {
            toast.error("Data de início da tarefa não pode ser depois da data de término da tarefa.", { duration: 3000 });
            return;
          }
        }

                const response = await axios.patch(`/api/projects/tasks/${currentProject?.id}`, {
                    task: task,
                });
                if (response.status !== 201) {
                    throw new Error("Erro ao atualizar tarefa");
                }
                const updatedTask = {
                    ...response.data.task,
                    start: response.data.task.start ? new Date(response.data.task.start) : new Date(),
                    finish: response.data.task.finish ? new Date(response.data.task.finish) : new Date(),
                    lastUpdated: response.data.task.lastUpdated ? new Date(response.data.task.lastUpdated) : new Date(),
                    finished: response.data.task.finishedd ? new Date(response.data.task.finishedd) : new Date(),
                };

        setCurrentProjectTasks((prevTasks) => [
          ...prevTasks.filter((t) => t.id !== task.id),
          updatedTask,
        ]);
        toast.success("Tarefa atualizada com sucesso!");
        setTaskUpdateTrigger((prev) => prev + 1);
        setShowTaskForm(false);
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        toast.error("Erro ao atualizar tarefa");
      }
    } else {
      try {

        if (task.start && currentProject?.finish && task.finish) {
          if (new Date(task.start) > new Date(currentProject.finish)) {
            toast.error("Data de início da tarefa não pode ser depois da data de término do projeto.", { duration: 3000 });
            return;
          } else if (new Date(task.finish) > new Date(currentProject.finish)) {
            toast.error("Data de término da tarefa não pode ser depois da data de término do projeto.", { duration: 3000 });
            return;
          } else if (new Date(task.start) > new Date(task.finish)) {
            toast.error("Data de início da tarefa não pode ser depois da data de término da tarefa.", { duration: 3000 });
            return;
          }
        }

                const response = await axios.post(`api/projects/${projectId}/tasks`, {
                    task: task,
                });

        if (response.status !== 201) {
          throw new Error("Erro ao adicionar tarefa");
        }
        const newTask = {
          ...response.data.task,
          start: response.data.task.start
            ? new Date(response.data.task.start)
            : new Date(),
          finish: response.data.task.finish
            ? new Date(response.data.task.finish)
            : new Date(),
          lastUpdated: response.data.task.lastUpdated
            ? new Date(response.data.task.lastUpdated)
            : new Date(),
          finished: response.data.task.finishedd
            ? new Date(response.data.task.finishedd)
            : new Date(),
        };

        setCurrentProjectTasks((prevTasks) => [...prevTasks, newTask]);
        toast.success("Tarefa criada com sucesso!");
        setTaskUpdateTrigger((prev) => prev + 1);
        setShowTaskForm(false);
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        toast.error("Erro ao adicionar tarefa");
      }
    }
  };

    const setTaskUser = async (task: Task, userId: number) => {
        try {
            const response = await axios.patch(`/api/projects/tasks`, {
                taskId: task.id,
                taskUser: userId,
            });
            if (response.status !== 201) {
                throw new Error("Erro ao atualizar tarefa");
            }
            toast.success("Usuário atribuído com sucesso!");
            setCurrentProjectTasks((prevTasks) =>
                prevTasks.map((t) => {
                    if (t.id === task.id) {
                        return {
                            ...t,
                            taskUser: userId,
                        };
                    }
                    return t;
                })
            );
            setCurrentEditingTask((prevTask) => {
                if (prevTask) {
                    return {
                        ...prevTask,
                        taskUser: userId,
                    };
                }
                return prevTask;
            });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            toast.error("Erro ao atualizar tarefa");
        }
    };

    const deleteTask = async (task: Task) => {
        try {
            const response = await axios.delete(`api/projects/tasks/${task.id}`);
            if (response.status !== 200) {
                throw new Error("Erro ao deletar tarefa");
            }
            toast.success("Tarefa deletada com sucesso!");
            setCurrentProjectTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
            setTaskUpdateTrigger((prev) => prev + 1);
            setShowTaskForm(false);
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

    const handleTaskFormOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (taskFormRef.current && !taskFormRef.current.contains(e.target as Node)) {
            setShowTaskForm(false);
            setCurrentEditingTask(null);
        }
    };

    const handleProjectEditorOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (projectEditorRef.current && !projectEditorRef.current.contains(e.target as Node)) {
            setEditing(false);
        }
    };

    if (loading) return <div>Carregando...</div>;

    if (!currentProject || !currentProjectCreator) {
        return <div>Falha ao carregar detalhes do projeto.</div>;
    }

  return (
    <div className="flex flex-col relative">
      {showTaskForm && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleTaskFormOutsideClick}
        >
          <div
            ref={taskFormRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
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
              <GradientText>
                {currentEditingTask ? "Editar Tarefa" : "Nova Tarefa"}
              </GradientText>
            </div>
            <TaskForm
              projectFinish={currentProject.finish ? new Date(currentProject.finish).toISOString() : ""}
              projectStart={currentProject.start ? new Date(currentProject.start).toISOString() : ""}
              projectMembers={currentProject.projectMember}
              projectCreator={currentProjectCreator}
              task={currentEditingTask}
              toggleForm={() => {

                setCurrentEditingTask(null);
              }}
              addTask={addTask}
              deleteTask={deleteTask}
              setTaskUser={setTaskUser}
            />
          </div>
        </div>
      )}

            <div className="flex flex-col px-4 py-2">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="p-4 max-w-4xl mx-auto relative">
                        <button
                            onClick={() => {
                                closeSelectedProjectAction();
                            }}
                            className="absolute top-4 left-8 text-3xl text-gray-700 hover:text-gray-900"
                        >
                            &#60;
                        </button>
                        <h1 className="text-blue-600 text-2xl font-semibold text-center mt-2">{currentProject.name}</h1>
                        <Button variant="outline" onClick={() => setEditing(true)} className="absolute top-4 right-8 text-black rounded-lg">
                            <Settings size={16} />
                        </Button>
                    </div>

                    <TabNavigation onTabChange={(tab) => setCurrentTab(tab)} />

                    <div className="mt-4">
                        {currentTab === "Descrição" && (
                            <DescriptionComponent
                                currentProject={currentProject}
                                currentProjectCreator={currentProjectCreator}
                                projectMembers={projectMembers} // <-- novo prop
                                tasks={currentProjectTasks} 
                            />
                        )}
                        {currentTab === "Kanban" && (
                            <KanbanBoard
                                tasks={currentProjectTasks}
                                onEditTask={handleEditTask}
                                projectId={projectId}
                                onTaskUpdate={(updatedTask) => {
                                    setCurrentProjectTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
                                    setTaskUpdateTrigger((prev) => prev + 1);
                                }}
                            />
                        )}
                        {currentTab === "Relatórios" && (
                            <Report
                                key={taskUpdateTrigger}
                                events={calendarEvents}
                                tasks={currentProjectTasks}
                                currentProject={currentProject}
                                projectCreator={currentProjectCreator}
                            />
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
                                    setTaskUpdateTrigger((prev) => prev + 1);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center" onClick={handleProjectEditorOutsideClick}>
                    <div ref={projectEditorRef} onClick={(e) => e.stopPropagation()}>
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
                            users={projectMembers} // <-- passe o estado aqui
                            setProjectMembers={setProjectMembers} // <-- novo prop
                            creator={currentProjectCreator}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
