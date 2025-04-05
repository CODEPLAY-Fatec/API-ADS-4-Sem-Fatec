"use client";

import { useEffect, useState } from "react";
import TabNavigation from "@/created-components/TabNavigation";
import ProjectEditor from "@/created-components/ProjectEditor";
import ProjectType from "@shared/Project";
import { User } from "@shared/User";
import axios from "axios";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";

type Project = ProjectType & {
  projectMember: User[];
  tasks?: TaskFromAPI[];
};

type TaskFromAPI = {
  id: number;
  name: string;
  dueDate: string;
  status: string;
};

type ProjectDetailsProps = {
  projectId: number;
  closeSelectedProject: () => void;
};

export default function ProjectDetails({ projectId, closeSelectedProject }: ProjectDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentProjectCreator, setCurrentProjectCreator] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<TaskEvent[]>([]);

  function getStatusColor(status: string): string {
    switch (status) {
      case "Em andamento":
        return "bg-yellow-500 text-white";
      case "Concluído":
        return "bg-green-500 text-white";
      case "Cancelado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        console.warn(response.data);

        setCurrentProject(response.data.project);
        setCurrentProjectCreator(response.data.creator);

        // Mapeando tarefas para eventos do calendário
        if (response.data.tasks) {
          const events = response.data.tasks.map((task: TaskFromAPI) => ({
            id: task.id,
            title: task.name,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            status: task.status.toLowerCase() as TaskEvent["status"],
          }));
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
    <div className="w-full max-w-7xl pt-50 mx-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center text-blue-600 text-2xl font-semibold">
          <div className="flex items-center space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={closeSelectedProject}
            >
              ←
            </button>
            <h1>{currentProject.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {editing && (
              <ProjectEditor
                project={currentProject}
                onClose={() => setEditing(false)}
                users={currentProject.projectMember}
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
      </div>

      <TabNavigation onTabChange={(tab) => console.log("Aba ativa:", tab)} />

      <div className="border p-6 mt rounded-lg shadow-sm">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Título</span>
            <h2 className="text-xl font-bold mt-2">{currentProject.name}</h2>
          </div>
          <div className="flex space-x-2">
            <span className="border px-3 py-1 rounded-lg text-sm">
              {currentProject.subject || "Sem categoria"}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(currentProject.status)}`}>
              {currentProject.status}
            </span>
          </div>
        </div>

        <div className="mt-8 max-w-5xl mx-auto">
          <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Descrição</span>
          <p className="mt-2">{currentProject.description || "Sem descrição disponível."}</p>
        </div>

        <div className="flex justify-between mt-8 max-w-5xl mx-auto">
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Responsáveis</span>
            <ul className="mt-2 list-disc ml-4">
              <li>{currentProjectCreator.name}</li>
            </ul>
          </div>
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Colaboradores</span>
            <ul className="mt-2 list-disc ml-4">
              {currentProject.projectMember.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Data de início</span>
                <p className="mt-2">01/01/2025</p>
              </div>
              <div className="mt-6">
                <TaskCalendar
                  events={calendarEvents}
                  onSelectEvent={(event) => {
                    console.log("Tarefa selecionada:", event);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
