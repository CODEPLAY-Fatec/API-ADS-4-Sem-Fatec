"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  subject: string;
  institution: string;
}

interface Task {
  id: number;
  title: string;
  projectName: string;
  finish: string;
}

export const Activities: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get("/api/projects/user/task", { withCredentials: true }),
          axios.get("/api/projects", { withCredentials: true }),
        ]);
        setTasks(tasksResponse.data.tasks);
        setProjects(projectsResponse.data.result);
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Atividades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Projetos Criados */}
        <div className="rounded-xl shadow bg-white p-4 overflow-x-auto">
          <h3 className="font-medium mb-2">Projetos que você faz parte</h3>
          {projects.length > 0 ? (
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b font-semibold text-left">
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Instituição</th>
                  <th className="py-2 px-3">Tema</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="py-2 px-3">{project.name}</td>
                    <td className="py-2 px-3">{project.institution}</td>
                    <td className="py-2 px-3">{project.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600">Nenhum projeto criado.</p>
          )}
        </div>

        {/* Últimas Tarefas */}
        <div className="rounded-xl shadow bg-white p-4 overflow-x-auto">
          <h3 className="font-medium mb-2">Últimas Tarefas</h3>
          {tasks.length > 0 ? (
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b font-semibold text-left">
                  <th className="py-2 px-3">Título</th>
                  <th className="py-2 px-3">Projeto</th>
                  <th className="py-2 px-3">Entrega</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="py-2 px-3">{task.title}</td>
                    <td className="py-2 px-3">{task.projectName}</td>
                    <td className="py-2 px-3">{task.finish || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600">Nenhuma tarefa atribuída a você no momento.</p>
          )}
        </div>
        
      </div>
    </div>
  );
};
