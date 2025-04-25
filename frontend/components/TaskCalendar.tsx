"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "./calendarStyles.css";
import Task from "@shared/Task";

moment.locale("pt-BR");
const localizer = momentLocalizer(moment);

export interface TaskEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  status?: Task["status"];
  description?: string;
}

interface TaskCalendarProps {
  events: TaskEvent[];
}

const TaskModal = ({ tasks, onClose }: { tasks: TaskEvent[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Container do modal sem fundo escuro */}
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs w-full relative border border-gray-200">
        {/* Botão X na posição desejada (X azul) */}
        <button 
          onClick={onClose}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full 
                    w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-800
                    transition-colors duration-200 focus:outline-none"
          aria-label="Fechar modal"
        >
          ✕
        </button>
        
        <h2 className="text-lg font-semibold mb-2">Tarefas terminando</h2>
        <div className="space-y-1 max-h-[60vh] overflow-y-auto">
          {tasks.map(task => (
            <div key={task.id} className="border-b pb-2 last:border-b-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">{task.title}</h3>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  task.status === 'Concluido' ? 'bg-green-100 text-green-800' :
                  task.status === 'Em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function TaskCalendar({ events }: TaskCalendarProps) {
  const [tasksForDate, setTasksForDate] = useState<TaskEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DateCell = ({ children, value }: { children: React.ReactNode, value: Date }) => {
    const isTaskFinishDate = events.some(event => {
      const eventDate = new Date(event.end).setHours(0, 0, 0, 0);
      const cellDate = new Date(value).setHours(0, 0, 0, 0);
      return eventDate === cellDate;
    });

    const handleClick = () => {
      if (isTaskFinishDate) {
        const tasks = events.filter(event => {
          const eventDate = new Date(event.end).setHours(0, 0, 0, 0);
          const cellDate = new Date(value).setHours(0, 0, 0, 0);
          return eventDate === cellDate;
        });
        setTasksForDate(tasks);
        setIsModalOpen(true);
      }
    };

    return (
      <div 
        className="relative h-full w-full flex justify-center items-center"
        onClick={handleClick}
      >
        <div className="relative">
          {children}
          {isTaskFinishDate && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full z-10"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[35rem] mx-auto">
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        components={{
          dateCellWrapper: DateCell,
          toolbar: () => null,
          event: () => null
        }}
        selectable
        defaultView="month"
        views={["month"]}
        style={{
          height: "400px",
          margin: "0 auto",
          width: "100%"
        }}
      />

      {isModalOpen && (
        <TaskModal 
          tasks={tasksForDate} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}