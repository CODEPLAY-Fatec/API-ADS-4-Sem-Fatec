import PieChart from "@/components/PieChart";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";
import TaskStatsCards from "@/components/TaskStatsCards";
import UserTaskBarChart from "@/components/UserTaskBarChart";
import FetchedProject from "@/types/FetchedProject";
import Task from "@shared/Task";
import { User } from "@shared/User"; // Import the User type

interface ReportProps {
    events: TaskEvent[];
    tasks: Task[];
    currentProject: FetchedProject; // Adicionamos currentProject aqui
    projectCreator: User;
}

export default function Report({ events, tasks, currentProject, projectCreator }: ReportProps) {
    // Derivamos os usuários diretamente de currentProject
    const users = currentProject.projectMember || [];

    return (
        <div className="border rounded-lg shadow-sm overflow-hidden h-[55vh] flex flex-col">
            <div className="p-4 overflow-y-auto flex-1">
                <div className="mx-auto py-2">
                    <TaskStatsCards tasks={tasks} />
                    <div className="flex flex-row space-x-4 mt-4">
                        <div className="flex-1">
                            <TaskCalendar events={events} />
                        </div>
                        <div className="flex-1 max-h-[370px] border rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                            <PieChart tasks={tasks} />
                        </div>
                    </div>
                    <div className="flex flex-row space-x-4 mt-4">
                        <div className="flex-1 max-h-[370px] border rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                            {/* Passamos tasks e users diretamente para o gráfico */}
                            <UserTaskBarChart tasks={tasks} users={users} projectCreator={projectCreator} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
