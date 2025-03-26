"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    axios.post("/api/logout", {}, { withCredentials: true })
      .then(() => {
        toast.success("Logout realizado!", { duration: 2000 });
        router.push("/");
      })
      .catch((error) => {
        toast.error("Erro ao realizar logout");
        console.error(error);
      });
  }
  return (
    <nav className="absolute top-4 left-0 right-0 flex justify-between items-center px-6">
      {/*Logo*/}
      <button onClick={() => router.push("/projetos")}>
        <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-lg" />
      </button>

      <div className="flex items-center gap-6">
        {/*IA*/}
        <button className="text-gray-700 hover:text-gray-900 flex items-center">
          <img src="/ia-chat.png" alt="Chat IA" className="h-8" />
        </button>

        {/*Perfil*/}
        <div className="relative dropdown">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-gray-700 hover:text-gray-900 flex items-center"
          >
            <img src="/profile.png" alt="Perfil" className="h-8" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
              <button 
                onClick={() => router.push("/perfil")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Informações
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
