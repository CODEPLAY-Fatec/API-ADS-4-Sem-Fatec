import FetchedProject from "@/types/FetchedProject";
import { User } from "@shared/User";
import UserAvatar from "./UserAvatar";
import Task from "@shared/Task";

interface DescriptionComponentProps {
    currentProject: FetchedProject;
    currentProjectCreator: User;
    projectMembers: User[]; 
    tasks?: Task[]; 
}

export default function DescriptionComponent({
    currentProject,
    currentProjectCreator,
    projectMembers,
    tasks = [], 
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
                <span className="bg-blue-900 text-white px-3 py-1 rounded-lg text-sm mb-2">{title}</span>
                <div className="w-full">{content}</div>
            </div>
        </div>
    );

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        
        const completedTasks = tasks.filter(task => task.status === "Concluido").length;
        const inProgressTasks = tasks.filter(task => task.status === "Em_andamento").length;
        
        // concluída vale 100, em andamento vale 50, fechada vale 0
        const totalProgress = completedTasks * 100 + inProgressTasks * 50;
        const maxProgress = tasks.length * 100;
        return Math.round((totalProgress / maxProgress) * 100);
    };

    const progressPercent = calculateProgress();
    const getProgressColorClass = () => {
        if (progressPercent < 30) return "bg-red-500";
        if (progressPercent < 70) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <div className="border rounded-lg shadow-sm overflow-hidden h-[55vh] flex flex-col">
            <div className="p-4 overflow-y-auto flex-1">
                <h2 className="text-xl font-bold mb-4 text-left">Descrição</h2>

                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                        <div className="flex flex-col mx-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                {renderInfoItem("Título", <h2 className="text-xl font-bold break-words">{currentProject.name}</h2>)}
                                {renderInfoItem(
                                    "Descrição",
                                    <p className="break-words text-gray-600">{currentProject.description || "Sem descrição disponível."}</p>
                                )}
                                {/* Novo card com a barra de progresso */}
                                {renderInfoItem(
                                    "Progresso",
                                    <div className="w-full">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                                {progressPercent}% Completo
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${getProgressColorClass()}`} 
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                            <span>Concluídas: {tasks.filter(task => task.status === "Concluido").length}</span>
                                            <span>Em andamento: {tasks.filter(task => task.status === "Em_andamento").length}</span>
                                            <span>Fechadas: {tasks.filter(task => task.status === "Fechado").length}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col mx-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                {renderInfoItem(
                                    "Responsável",
                                    <div className="flex items-center gap-2">
                                        <UserAvatar userId={currentProjectCreator.id} name={currentProjectCreator.name} showName={true} size="md" />
                                    </div>
                                )}
                                {renderInfoItem(
                                    "Colaboradores",
                                    <div className="space-y-2">
                                        {projectMembers && projectMembers.length > 0 ? (
                                            projectMembers.map((user) => (
                                                <div key={user.id} className="flex items-center gap-2">
                                                    <UserAvatar userId={user.id} name={user.name} showName={true} size="md" />
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
                                        {currentProject.start ? currentProject.start.split("T")[0].split("-").reverse().join("/") : "Data não definida"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col mx-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                {renderInfoItem(
                                    "Área",
                                    <span className="border px-3 py-1 rounded-lg text-sm text-gray-600">{currentProject.subject || "Sem categoria"}</span>
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
                                            ? currentProject.finish.split("T")[0].split("-").reverse().join("/")
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
