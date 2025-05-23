import FetchedProject from "@/types/FetchedProject";
import { User } from "@shared/User";
import UserAvatar from "./UserAvatar";

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

  const renderInfoItem = (title: string, content: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-start">
        <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">
          {title}
        </span>
        <div className="w-full">{content}</div>
      </div>
    </div>
  );

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden h-[55vh] flex flex-col">
      <div className="p-4 overflow-y-auto flex-1">
        <h2 className="text-xl font-bold mb-4 text-left">Descrição</h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">

            <div className="flex flex-col mx-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                {renderInfoItem(
                  "Título",
                  <h2 className="text-xl font-bold break-words">{currentProject.name}</h2>
                )}
                {renderInfoItem(
                  "Descrição",
                  <p className="break-words text-gray-600">
                    {currentProject.description || "Sem descrição disponível."}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col mx-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                {renderInfoItem(
                  "Responsável",
                  <div className="flex items-center gap-2">
                    <UserAvatar 
                      userId={currentProjectCreator.id} 
                      name={currentProjectCreator.name} 
                      showName={true}
                      size="md"
                    />
                  </div>
                )}
                {renderInfoItem(
                  "Colaboradores",
                  <div className="space-y-2">
                    {currentProject.projectMember && currentProject.projectMember.length > 0 ? (
                      currentProject.projectMember.map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                          <UserAvatar 
                            userId={user.id} 
                            name={user.name} 
                            showName={true}
                            size="md"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">Ainda não há mais colaboradores</p>
                    )}
                  </div>
                )}
                {renderInfoItem(
                  "Data de início",
                  <p className="text-gray-600">
                    {currentProject.start
                      ? new Date(currentProject.start).toLocaleDateString()
                      : "Data não definida"}
                  </p>
                )}

              </div>
            </div>

            <div className="flex flex-col mx-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                {renderInfoItem(
                  "Área",
                  <span className="border px-3 py-1 rounded-lg text-sm text-gray-600">
                    {currentProject.subject || "Sem categoria"}
                  </span>
                )}
                {renderInfoItem(
                  "Status",
                  <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(currentProject.status)}`}>
                    {formatStatus(currentProject.status)}
                  </span>
                )}
                {renderInfoItem(
                  "Data de término",
                  <p className="text-gray-600">
                    {currentProject.finish
                      ? new Date(currentProject.finish).toLocaleDateString()
                      : "Data de finalização não definida"}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
