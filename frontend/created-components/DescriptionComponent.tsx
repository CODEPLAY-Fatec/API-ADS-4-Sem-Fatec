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
        return "bg-blue-500 text-white";
      case "Concluido":
        return "bg-green-500 text-white";
      case "Fechado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatStatus = (status: FetchedProject["status"]) => {
    switch (status) {
      case "Em_andamento":
        return "Em andamento";
      case "Concluido":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden h-[55vh] flex flex-col">
      <div className="p-4 overflow-y-auto flex-1">
        <h2 className="text-xl font-bold mb-4 text-left">Descrição</h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
            <div className="flex flex-col">
              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Título
                </span>
                <h2 className="text-xl font-bold">{currentProject.name}</h2>
              </div>

              <div className="flex flex-col items-start">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Descrição
                </span>
                <p className="break-words">
                  {currentProject.description || "Sem descrição disponível."}
                </p>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden">
              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Responsável
                </span>
                <ul className="list-disc ml-4">
                  <li>{currentProjectCreator.name}</li>
                </ul>
              </div>

              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Colaboradores
                </span>
                <ul className="list-disc ml-4">
                  {currentProject.projectMember.length > 0 ? (
                    currentProject.projectMember.map((user) => (
                      <li key={user.id}>{user.name}</li>
                    ))
                  ) : (
                    <li>Ainda não há mais colaboradores</li>
                  )}
                </ul>
              </div>

              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Data de início
                </span>
                <p>01/01/2025</p>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden">
              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Área
                </span>
                <span className="border px-3 py-1 rounded-lg text-sm">
                  {currentProject.subject || "Sem categoria"}
                </span>
              </div>

              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(
                    currentProject.status,
                  )}`}
                >
                  {formatStatus(currentProject.status)}
                </span>
              </div>

              <div className="flex flex-col items-start mb-8">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
                  Data de término
                </span>
                <p>31/12/2025</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

