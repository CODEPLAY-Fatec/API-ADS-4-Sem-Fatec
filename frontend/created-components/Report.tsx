import React from "react";
import { TaskCalendar, TaskEvent } from "@/components/TaskCalendar";

interface ReportProps {
  events: TaskEvent[];
}

export default function Report({ events }: ReportProps) {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="mx-auto pl-15 pr-2 py-2">
          <TaskCalendar events={events} />
        </div>
      </div>
    </div>
  );
}