import PieChart from "@/components/PieChart";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";
import Task from "@shared/Task";

interface ReportProps {
    events: TaskEvent[];
    tasks: Task[];
}

export default function Report({ events, tasks }: ReportProps) {
    return (
        <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="mx-auto pl-15 pr-2 py-2">
                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <TaskCalendar events={events} />
                        </div>
                        <div className="flex-1 max-h-[370px] border rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                            <PieChart tasks={tasks} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
