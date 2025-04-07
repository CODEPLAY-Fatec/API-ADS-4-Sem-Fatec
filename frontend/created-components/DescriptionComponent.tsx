import { TaskEvent } from "@/components/TaskCalendar";
import FetchedProject from "@/types/FetchedProject";
import { User } from "@shared/User";

interface DescriptionComponentProps {
  currentProject: FetchedProject;
  currentProjectCreator: User;
}

export default function DescriptionComponent({
  currentProject,
  currentProjectCreator,
}: DescriptionComponentProps) {
  const getStatusColor = (status: FetchedProject["status"]) => {
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
  };

  return (
    <div className="border p-6 mt rounded-lg shadow-sm">
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
        <p className="mt-2">
          {currentProject.description || "Sem descrição disponível."}
        </p>
      </div>

      <div className="flex justify-between mt-8 max-w-5xl mx-auto">
        <div>
          <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
            Responsável
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
          <div className="flex items-center gap-2">
            <div>
              <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm">
                Data de início
              </span>
              <p className="mt-2">01/01/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
