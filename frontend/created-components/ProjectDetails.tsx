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

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const projectResponse = await axios.get(`/api/projects/${projectId}`);
        const projectTasksResponse = await axios.get(
          `/api/projects/${projectId}/tasks`,
        );

        setCurrentProject(projectResponse.data.project);
        setCurrentProjectCreator(projectResponse.data.creator);
        console.warn(projectTasksResponse.data);
        setCurrentProjectTasks(projectTasksResponse.data);

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

  if (loading) return <div>Carregando...</div>;

  if (!currentProject || !currentProjectCreator) {
    return <div>Falha ao carregar detalhes do projeto.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex flex-col flex-grow px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="p-6 max-w-4xl mx-auto relative">
            <button
              onClick={() => {
                console.log("Redirecionando para /projetos");
                //router.push("/projetos");
                closeSelectedProjectAction();
              }}
              className="absolute top-16 left-8 text-3xl text-gray-700 hover:text-gray-900"
            >
              &#60;
            </button>
            <h1 className="text-blue-600 text-2xl font-semibold text-center mt-8">
              {currentProject.name}
            </h1>
            <button
              onClick={() => setEditing(true)}
              className="absolute top-16 right-8 bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition duration-200 text-sm"
            >
              Editar
            </button>
          </div>

          <TabNavigation onTabChange={(tab) => setCurrentTab(tab)} />

          {/* Conteúdo da aba selecionada */}
          <div className="mt-8">
            {currentTab === "Descrição" && (
              <DescriptionComponent
                currentProject={currentProject}
                currentProjectCreator={currentProjectCreator}
              />
            )}
            {currentTab === "Relatórios" && (
              <TaskCalendar events={calendarEvents} />
            )}
            {currentTab === "Tarefas" && (
              <TaskList
                tasks={currentProjectTasks}
                setTasks={(t: Task[]): void => {
                  setCurrentProjectTasks(t);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {editing && (
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
      )}
    </div>
  );
}
