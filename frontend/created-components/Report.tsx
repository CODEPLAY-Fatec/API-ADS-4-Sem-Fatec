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
                    <div className="flex flex-col space-y-4">
                        <div>
                            <TaskCalendar events={events} />
                        </div>
                        <div className="max-h-[400px] w-full">
                            <PieChart tasks={tasks} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
