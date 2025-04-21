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
    <div className="mt-2">
      <h2 className="text-base font-semibold mb-2">Atividades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

        {/* Projetos Criados */}
        <div className="rounded-xl shadow bg-white p-3">
          <h3 className="font-medium mb-2">Projetos que você faz parte</h3>
          <div className="h-[150px] overflow-y-auto">
            {projects.length > 0 ? (
              <table className="min-w-full text-sm text-gray-700">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b font-semibold text-left">
                    <th className="py-1 px-2">Nome</th>
                    <th className="py-1 px-2">Instituição</th>
                    <th className="py-1 px-2">Tema</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="py-1 px-2">{project.name}</td>
                      <td className="py-1 px-2">{project.institution}</td>
                      <td className="py-1 px-2">{project.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-600">Nenhum projeto criado.</p>
            )}
          </div>
        </div>

        {/* Últimas Tarefas */}
        <div className="rounded-xl shadow bg-white p-3">
          <h3 className="font-medium mb-2">Últimas Tarefas</h3>
          <div className="h-[150px] overflow-y-auto">
            {tasks.length > 0 ? (
              <table className="min-w-full text-sm text-gray-700">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b font-semibold text-left">
                    <th className="py-1 px-2">Título</th>
                    <th className="py-1 px-2">Projeto</th>
                    <th className="py-1 px-2">Entrega</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-1 px-2">{task.title}</td>
                      <td className="py-1 px-2">{task.projectName}</td>
                      <td className="py-1 px-2">{task.finish || "-"}</td>
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
    </div>
  );
};
