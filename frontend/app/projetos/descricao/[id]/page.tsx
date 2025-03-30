"use client"; // Indica que este componente roda no lado do cliente

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/created-components/Navbar";
import TabNavigation from "@/created-components/TabNavigation";
import ProjectDetails from "@/created-components/ProjectDetails";

interface Project {
  id: number;
  name: string;
  description: string | null;
  subject: string | null;
  institution: string | null;
  creator: number;
  status: string;
}


export default function DescricaoPage() {
  const params = useParams(); // Obtendo params corretamente
  const [project, setProject] = useState<Project | null>(null);
  const [creatorName, setCreatorName] = useState<string>("Desconhecido");


  useEffect(() => {
    async function fetchProject() {
      if (!params.id) return;

      // Buscar projeto
      const res = await fetch(`http://localhost:3000/api/projects/${params.id}`);
      if (!res.ok) return;

      const projectData: Project = await res.json();
      setProject(projectData);

      // Buscar nome do criador
      const userRes = await fetch(`http://localhost:3000/api/users?creatorId=${projectData.creator}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setCreatorName(userData.name);
      }
    }

    fetchProject();
  }, [params.id]);

  if (!project) return <div>Carregando...</div>;

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Em andamento':
        return 'bg-yellow-500 text-white';
      case 'Concluído':
        return 'bg-green-500 text-white';
      case 'Cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-col flex-grow px-4 py-8">
        <div className="w-full max-w-7xl pt-50 mx-auto">

          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center text-blue-600 text-2xl font-semibold">
              {/* Botão de voltar e título */}
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 transition">
                  ←
                </button>
                <h1>{project.name}</h1>
              </div>

              {/* Botão de editar */}
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                Editar
              </button>
            </div>
          </div>
          <TabNavigation onTabChange={(tab) => console.log("Aba ativa:", tab)} />
          <div className="border p-6 mt rounded-lg shadow-sm ">
            <div className="flex justify-between items-center max-w-5xl mx-auto">
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Título</span>
                <h2 className="text-xl font-bold mt-2">{project.name}</h2> {/* Nome do projeto dinâmico */}
              </div>
              <div className="flex space-x-2">
                <span className="border px-3 py-1 rounded-lg text-sm">{project.subject || 'Sem categoria'}</span>
                <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-5xl mx-auto ">
              <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Descrição</span>
              <p className="mt-2">{project.description || 'Sem descrição disponível.'}</p> {/* Descrição dinâmica */}
            </div>

            <div className="flex justify-between mt-8 max-w-5xl mx-auto ">
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Responsáveis</span>
                <ul className="mt-2 list-disc ml-4">
                  <li>{creatorName}</li>
                  <li>Responsável 2</li>
                </ul>
              </div>
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Colaboradores</span>
                <ul className="mt-2 list-disc ml-4">
                  <li>Colaborador 1</li>
                  <li>Colaborador 2</li>
                  <li>Colaborador 3</li>
                </ul>
              </div>
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">Data de início</span>
                <p className="mt-2">01/01/2025</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
