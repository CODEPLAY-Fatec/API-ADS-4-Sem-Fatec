"use client";

import { useEffect, useState } from "react";
import TabNavigation from "@/created-components/TabNavigation";
import ProjectEditor from "@/created-components/ProjectEditor";
import ProjectType from "@shared/Project";
import { User } from "@shared/User";
import axios from "axios";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";
import Task from "@shared/Task";
import FetchedProject from "@/types/FetchedProject";
import { Description } from "@headlessui/react";
import DescriptionComponent from "./DescriptionComponent";

//type TaskFromAPI = {
//  id: number;
//  name: string;
//  dueDate: string;
//  status: string;
//  projectMember: { users: User }[];
//};

type ProjectDetailsProps = {
  projectId: number;
  closeSelectedProjectAction: () => void;
};

export default function ProjectDetails({
  projectId,
  closeSelectedProjectAction,
}: ProjectDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<FetchedProject | null>(null);
  const [currentProjectCreator, setCurrentProjectCreator] = useState<User | null>(null);
  const [currentProjectTasks, setCurrentProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<TaskEvent[]>([]);
  const [currentTab, setCurrentTab] = useState("Descrição");

  function getStatusColor(status: ProjectType["status"]): string {
    switch (status) {
      case "Em_andamento":
        return "bg-yellow-500 text-white";
      case "Concluido":
        return "bg-green-500 text-white";
      case "Fechado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const projectResponse = await axios.get(`/api/projects/${projectId}`);
        const projectTasksResponse = await axios.get(`/api/projects/${projectId}/tasks`)
        console.warn(projectResponse.data);
        console.warn(projectTasksResponse.data);
        setCurrentProject(projectResponse.data.project);
        setCurrentProjectCreator(projectResponse.data.creator);
        setCurrentProjectTasks(projectTasksResponse.data.tasks);

        // Mapeando tarefas para eventos do calendário
        if (projectResponse.data.tasks) {
          const events = currentProjectTasks.map((task: Task) => ({
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
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center text-blue-600 text-2xl font-semibold">
          <div className="flex items-center space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={closeSelectedProjectAction}
            >
              ←
            </button>
            <h1>{currentProject.name}</h1>
          </div>

          {/* Botão de editar */}
          {editing && (
            <ProjectEditor
              project={currentProject}
              setCurrentProject={(project) => {
                setCurrentProject(project);
              }}
              onClose={() => setEditing(false)}
              users={currentProject.projectMember}
              creator={currentProjectCreator}
            />
          )}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        </div>
      </div>

      <TabNavigation onTabChange={(tab) => {
          setCurrentTab(tab);
      }} />

      {/* Renderiza o conteúdo da aba selecionada */}
      {currentTab === "Descrição" && (
          <DescriptionComponent currentProject={currentProject} currentProjectCreator={currentProjectCreator} />
      )}
    </>
  );
}
