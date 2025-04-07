"use client"; 

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
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
  allDay?: boolean;
}

interface TaskCalendarProps {
  events: TaskEvent[];
  onSelectEvent?: (event: TaskEvent) => void;
}

export function TaskCalendar({ events, onSelectEvent }: TaskCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const eventStyleGetter = (event: TaskEvent) => {
    let backgroundColor = "#3B82F6";

    if (event.status === "Concluido") backgroundColor = "#10B981";
    else if (event.status === "Fechado") backgroundColor = "#EF4444";
    else if (event.status === "Em_andamento") backgroundColor = "#F59E0B";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        border: "none",
        color: "white",
        fontSize: "0.75rem",
        padding: "4px 8px",
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const isSelected =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    return {
      style: {
        backgroundColor: isSelected ? "#6366f1" : undefined,
        color: isSelected ? "white" : undefined,
        borderRadius: isSelected ? "8px" : undefined,
        boxShadow: isSelected
          ? "inset 0 0 4px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.3)"
          : undefined,
      },
    };
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Abrir calendário"
      >
        <FiCalendar size={24} />
      </button>

      {isExpanded && (
        <div className="absolute right-0 bottom-full mb-3 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-[700px] h-[700px] animate-fade-in">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={onSelectEvent}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            selectable
            onSelectSlot={(slotInfo) => {
              const clickedDate = slotInfo.start;
              const isSameDate =
                selectedDate &&
                clickedDate.toDateString() === selectedDate.toDateString();

              if (isSameDate) {
                setSelectedDate(null); // desseleciona data
              } else {
                setSelectedDate(clickedDate); // seleciona nova data
              }
            }}
            defaultView="month"
            views={["month"]}
            popup
            messages={{
              month: "Mês",
              today: "Hoje",
              previous: "←",
              next: "→",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              date: "Data",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "Nenhum evento neste período.",
            }}
            components={{
              toolbar: () => null,
            }}
            style={{
              fontSize: "0.8rem",
              borderRadius: "12px",
            }}
          />
        </div>
      )}
    </div>
  );
}
