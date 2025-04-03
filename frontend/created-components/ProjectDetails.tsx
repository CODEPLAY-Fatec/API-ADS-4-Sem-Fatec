"use client"; // Indica que este componente roda no lado do cliente

import { useEffect, useState } from "react";
import TabNavigation from "@/created-components/TabNavigation";
import ProjectEditor from "@/created-components/ProjectEditor";
import ProjectType from "@shared/Project";
import { User } from "@shared/User";
import axios from "axios";

type Project = ProjectType & {
  projectMember: User[];
};

type ProjectDetailsProps = {
  projectId: number; // Pass only the project ID
  closeSelectedProject: () => void;
};

export default function ProjectDetails(props: ProjectDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentProjectCreator, setCurrentProjectCreator] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get(`/api/projects/${props.projectId}`);
        console.warn(response.data)
        setCurrentProject(response.data.project);
        setCurrentProjectCreator(response.data.creator);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [props.projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentProject || !currentProjectCreator) {
    return <div>Failed to load project details.</div>;
  }

  return (
    <div className="w-full max-w-7xl pt-50 mx-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center text-blue-600 text-2xl font-semibold">
          {/* Botão de voltar e título */}
          <div className="flex items-center space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={props.closeSelectedProject}
            >
              ←
            </button>
            <h1>{currentProject.name}</h1>
          </div>

          {/* Botão de editar */}
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
      <TabNavigation onTabChange={(tab) => console.log("Aba ativa:", tab)} />
      <div className="border p-6 mt rounded-lg shadow-sm ">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
              Título
            </span>
            <h2 className="text-xl font-bold mt-2">{currentProject.name}</h2>
          </div>
          <div className="flex space-x-2">
            <span className="border px-3 py-1 rounded-lg text-sm">
              {currentProject.subject || "Sem categoria"}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(
                currentProject.status
              )}`}
            >
              {currentProject.status}
            </span>
          </div>
        </div>

        <div className="mt-8 max-w-5xl mx-auto ">
          <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
            Descrição
          </span>
          <p className="mt-2">{currentProject.description || "Sem descrição disponível."}</p>
        </div>

        <div className="flex justify-between mt-8 max-w-5xl mx-auto ">
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
              Responsáveis
            </span>
            <ul className="mt-2 list-disc ml-4">
              <li>{currentProjectCreator.name}</li>
            </ul>
          </div>
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
              Colaboradores
            </span>
            <ul className="mt-2 list-disc ml-4">
              {currentProject.projectMember.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
              Data de início
            </span>
            <p className="mt-2">01/01/2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
