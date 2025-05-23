"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ChatComponent from "./ChatComponent";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/me", { withCredentials: true });
        setUserId(response.data.id);
        setUserName(response.data.name);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    };
    
    fetchUserData();

    const handleStorageChange = () => {
      const refreshValue = localStorage.getItem('avatarRefreshKey');
      if (refreshValue) {
        setAvatarRefreshKey(parseInt(refreshValue));
      }
    };
    handleStorageChange();
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
    <>
      <nav className="absolute top-4 left-0 right-0 flex justify-between items-center px-6">
        {/*Logo*/}
        <button onClick={() => router.push("/projetos")}>
          <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-lg" />
        </button>

        <div className="flex items-center gap-6">
          {/*IA*/}
          <button
            className="text-gray-700 hover:text-gray-900 flex items-center"
            onClick={() => setChatOpen(!isChatOpen)}
          >
            <img src="/ia-chat.png" alt="Chat IA" className="h-8" />
          </button>

          {/*Perfil*/}
          <div className="relative dropdown">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 hover:text-gray-900 flex items-center"
            >
              {userId ? (
                <UserAvatar 
                  userId={userId} 
                  name={userName}
                  size="md" 
                  className="cursor-pointer"
                  refreshKey={avatarRefreshKey}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50 !z-[9999]">
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
      <ChatComponent visible={isChatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
