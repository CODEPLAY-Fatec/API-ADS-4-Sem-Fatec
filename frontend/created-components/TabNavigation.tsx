import { useState } from "react";
import { motion } from "framer-motion";

interface TabNavigationProps {
  onTabChange?: (tab: string) => void;
}

export default function TabNavigation({ onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const tabs = ["Descrição", "Kanban", "Tarefas", "Relatórios"];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="relative w-full flex bg-gray-100 p-2 rounded-lg shadow-md mb-4 overflow-hidden">
      <motion.div
        className="absolute top-2 bottom-2 rounded-md z-0 bg-blue-900"
        initial={false}
        animate={{
          width: `calc(${100 / tabs.length}% - 12px)`,
          left: `calc(${tabs.indexOf(activeTab) * (100 / tabs.length)}% + 4px)`,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 40 }}
      />
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`relative flex-1 px-4 py-2 text-center rounded-md z-10 transition-colors duration-200
            ${activeTab === tab ? "text-white font-semibold" : "text-gray-800"}`}
          style={{ backgroundColor: "transparent" }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}