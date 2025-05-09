"use client";

import { useState, useEffect } from "react";
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
  key?: number;
}

export function TaskCalendar({ events, key }: TaskCalendarProps) {
  const [localEvents, setLocalEvents] = useState<TaskEvent[]>(events);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    console.log("Eventos recebidos no calendário:", events);
    setLocalEvents(events);
  }, [events, key]);

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

  const weekDays = moment.weekdaysShort(true).map((day) => day.toUpperCase());

  const handlePreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate());
  };

  const handleDateClick = (date: Date) => {
    const hasTasks = localEvents.some((event) =>
      moment(event.end).isSame(date, "day")
    );

    if (hasTasks) {
      setSelectedDate(date);
      setShowTaskModal(true);
    }
  };

  const getTasksForDate = (date: Date) => {
    return localEvents.filter((event) => moment(event.end).isSame(date, "day"));
  };

  const isWeekend = (date: Date) => {
    const dayOfWeek = moment(date).day();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isCriticalDeadline = (taskDate: Date) => {
    return (
      moment(taskDate).isSameOrBefore(moment().add(3, "days")) &&
      moment(taskDate).isSameOrAfter(moment(), "day")
    );
  };

  const normalizeStatus = (status?: string) => {
    if (!status) return "";
    return status.toLowerCase().replace(/_/g, " ");
  };

  const getDayStyleClasses = (date: Date, tasksForDay: TaskEvent[]) => {
    const isCurrentMonth = moment(date).isSame(currentDate, "month");
    const isToday = moment(date).isSame(new Date(), "day");
    const hasTasks = tasksForDay.length > 0;
    const weekend = isWeekend(date);

    let baseClasses = `text-center p-2 text-sm rounded-md cursor-pointer relative ${
      isToday ? "bg-blue-100 text-blue-800" : ""
    } ${
      !isCurrentMonth
        ? "text-gray-400"
        : weekend
        ? "text-red-500"
        : "text-gray-800"
    } ${hasTasks ? "font-bold" : ""} hover:bg-gray-100 transition-colors duration-150`;

    const hasCriticalTasks = tasksForDay.some(
      (task) =>
        isCriticalDeadline(task.end) &&
        !normalizeStatus(task.status).includes("concluido") &&
        !normalizeStatus(task.status).includes("fechado")
    );
    const hasCompletedTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("concluido")
    );
    const hasInProgressTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("em andamento")
    );
    const hasClosedTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("fechado")
    );

    if (hasCriticalTasks) baseClasses += " ring-2 ring-red-500 bg-red-50";
    else if (hasCompletedTasks) baseClasses += " ring-2 ring-green-500 bg-green-50";
    else if (hasClosedTasks) baseClasses += " ring-2 ring-purple-500 bg-purple-50";
    else if (hasInProgressTasks) baseClasses += " ring-2 ring-blue-500 bg-blue-50";

    return baseClasses;
  };

  const getDotColor = (tasksForDay: TaskEvent[]) => {
    const hasCompletedTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("concluido")
    );
    const hasClosedTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("fechado")
    );
    const hasInProgressTasks = tasksForDay.some((task) =>
      normalizeStatus(task.status).includes("em andamento")
    );
    const hasCriticalTasks = tasksForDay.some(
      (task) =>
        isCriticalDeadline(task.end) &&
        !normalizeStatus(task.status).includes("concluido") &&
        !normalizeStatus(task.status).includes("fechado")
    );

    if (hasCriticalTasks) return "bg-red-500";
    if (hasCompletedTasks) return "bg-green-500";
    if (hasClosedTasks) return "bg-purple-500";
    if (hasInProgressTasks) return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white p-4 rounded-lg">
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

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const tasksForDay = getTasksForDate(date);
          const hasTasks = tasksForDay.length > 0;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={getDayStyleClasses(date, tasksForDay)}
            >
              {moment(date).date()}
              {hasTasks && (
                <div
                  className={`w-1 h-1 mx-auto mt-1 rounded-full ${getDotColor(tasksForDay)}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

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

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map((task) => {
                  const normalizedStatus = normalizeStatus(task.status);
                  const isCritical = isCriticalDeadline(task.end) && !normalizedStatus.includes("concluido") && !normalizedStatus.includes("fechado");
                  const isCompleted = normalizedStatus.includes("concluido");
                  const isClosed = normalizedStatus.includes("fechado");
                  const isInProgress = normalizedStatus.includes("em andamento");

                  let bgColorClass = "";
                  if (isCompleted) bgColorClass = "bg-green-100";
                  else if (isClosed) bgColorClass = "bg-purple-100";
                  else if (isCritical) bgColorClass = "bg-red-100";
                  else if (isInProgress) bgColorClass = "bg-blue-100";

                  let statusBoxClass = "";
                  if (isCompleted) statusBoxClass = "bg-green-500 text-white";
                  else if (isClosed) statusBoxClass = "bg-purple-500 text-white";
                  else if (isCritical) statusBoxClass = "bg-red-500 text-white";
                  else if (isInProgress) statusBoxClass = "bg-blue-500 text-white";
                  else statusBoxClass = "bg-gray-500 text-white";

                  return (
                    <div
                      key={task.id}
                      className={`border-b border-gray-100 pb-3 rounded-lg ${bgColorClass} p-3`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-medium">{task.title}</span>
                          {isCritical && (
                            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              URGENTE
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusBoxClass}`}
                        >
                          {task.status?.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                          {task.description}
                        </p>
                      )}

                      <p className="text-xs text-black font-bold mt-2">
                        Prazo: {moment(task.end).format("DD/MM/YYYY")}
                        {isCritical && (
                          <span className="text-red-600 font-medium ml-1">
                            ({moment(task.end).fromNow()})
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma tarefa para este dia
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}