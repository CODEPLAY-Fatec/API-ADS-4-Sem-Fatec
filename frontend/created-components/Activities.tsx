import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  name: string;
}

export const Activities: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Simulação de busca de dados da API
    const fetchActivities = async () => {
      try {
        // Substitua pelos endpoints reais da sua API
        const projectsResponse = await fetch("/api/user/projects");
        const tasksResponse = await fetch("/api/user/tasks");

        if (projectsResponse.ok && tasksResponse.ok) {
          const projectsData = await projectsResponse.json();
          const tasksData = await tasksResponse.json();

          setProjects(projectsData);
          setTasks(tasksData);
        } else {
          console.error("Erro ao buscar atividades.");
        }
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
        <div className="rounded-xl shadow bg-white p-4">
          <h3 className="font-medium">Projetos Criados</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))
            ) : (
              <li>Nenhum projeto criado.</li>
            )}
          </ul>
        </div>

        {/* Últimas Tarefas */}
        <div className="rounded-xl shadow bg-white p-4">
          <h3 className="font-medium">Últimas Tarefas</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id}>{task.name}</li>
              ))
            ) : (
              <li>Nenhuma tarefa concluída.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};