import { useState } from "react";

interface TabNavigationProps {
  onTabChange?: (tab: string) => void;
}

export default function TabNavigation({ onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const tabs = ["Descrição", "Kanban", "Tarefas", "Relatórios"];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab); // Se precisar executar algo ao mudar de aba
    }
  };

  return (
    <div className="w-full flex bg-gray-100 p-2 rounded-lg shadow-md mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`flex-1 px-4 py-2 rounded-md text-center ${
            activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

