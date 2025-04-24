import React from "react";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";

interface ReportProps {
  events: TaskEvent[];
}

export default function Report({ events }: ReportProps) {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="overflow-y-auto">
          <div className="scale-[1] origin-top-left">
            <TaskCalendar events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
