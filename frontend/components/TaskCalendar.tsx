"use client";

import { useState } from "react";
import moment from "moment";
import "moment/locale/pt-br";
import { ChevronLeft, ChevronRight } from "lucide-react";

moment.locale("pt-br");

export interface TaskEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  status?: "Fechado" | "Em andamento" | "Concluído" | "Em_andamento" | "Concluido" | undefined;
  description?: string;
}

interface TaskCalendarProps {
  events: TaskEvent[];
}

export function TaskCalendar({ events }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const monthStart = moment(currentDate).startOf("month");
  const monthEnd = moment(currentDate).endOf("month");
  const startDate = moment(monthStart).startOf("week");
  const endDate = moment(monthEnd).endOf("week");

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day.toDate());
    day = day.clone().add(1, "day");
  }

  const weekDays = moment.weekdaysShort(true).map(day => day.toUpperCase());

  const handlePreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate());
  };

  const handleDateClick = (date: Date) => {
    const hasTasks = events.some(event => 
      moment(event.end).isSame(date, "day")
    );
    
    if (hasTasks) {
      setSelectedDate(date);
      setShowTaskModal(true);
    }
  };

  const getTasksForDate = (date: Date) => {
    return events.filter(event => 
      moment(event.end).isSame(date, "day")
    );
  };

  const isWeekend = (date: Date) => {
    const dayOfWeek = moment(date).day();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Função para normalizar o status
  const normalizeStatus = (status?: string) => {
    if (!status) return '';
    return status.toLowerCase().replace(/_/g, ' ');
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white p-4 rounded-lg">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={handlePreviousMonth}
          className="text-gray-600 hover:text-gray-900 p-1"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          {moment(currentDate).format("MMMM YYYY").toUpperCase()}
        </h2>
        
        <button 
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-900 p-1"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`text-center text-xs font-medium ${
              index === 0 || index === 6 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = moment(date).isSame(currentDate, "month");
          const isToday = moment(date).isSame(new Date(), "day");
          const hasTasks = events.some(event => 
            moment(event.end).isSame(date, "day")
          );
          const weekend = isWeekend(date);

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`text-center p-2 text-sm rounded-md cursor-pointer
                ${isToday ? "bg-blue-100 text-blue-800" : ""}
                ${!isCurrentMonth ? "text-gray-400" : weekend ? "text-red-500" : "text-gray-800"}
                ${hasTasks ? "font-bold" : ""}
                hover:bg-gray-100
              `}
            >
              {moment(date).date()}
              {hasTasks && (
                <div className={`w-1 h-1 mx-auto mt-1 rounded-full ${
                  weekend ? "bg-red-500" : "bg-blue-500"
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {showTaskModal && selectedDate && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowTaskModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {moment(selectedDate).format("DD MMMM YYYY")}
              </h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map(task => {
                  // Normaliza o status para comparação
                  const normalizedStatus = normalizeStatus(task.status);
                  
                  return (
                    <div key={task.id} className="border-b border-gray-100 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{task.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          normalizedStatus.includes('concluido') ? 'bg-green-100 text-green-800' :
                          normalizedStatus.includes('em andamento') ? 'bg-blue-200 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.status?.replace('_', ' ')}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma tarefa para este dia</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}