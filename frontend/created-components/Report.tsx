import PieChart from "@/components/PieChart";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";
import TaskStatsCards from "@/components/TaskStatsCards";
import Task from "@shared/Task";
import UserTaskBarChart from "@/components/UserTaskBarChart";

interface ReportProps {
    events: TaskEvent[];
    tasks: Task[];
}

export default function Report({ events, tasks }: ReportProps) {
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
                            <UserTaskBarChart tasks={tasks} users={[]} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
