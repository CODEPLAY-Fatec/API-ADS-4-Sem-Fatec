"use client";

import { Activities } from "@/created-components/Activities";
import { ChangePassword } from "@/created-components/ChangePassword";
import Navbar from "@/created-components/Navbar";
import { ProfileForm } from "@/created-components/ProfileForm";
import { ProfilePicture } from "@/created-components/ProfilePicture";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0); 

  const [isSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await axios.get("/api/me", { withCredentials: true });
        setUserData({
          id: userInfo.data.id,
          name: userInfo.data.name,
          email: userInfo.data.email,
          phone: userInfo.data.phone,
        });
        
        try {
          const fotoData = await axios.get("/api/foto", { withCredentials: true });
          setProfilePicture(`data:image/png;base64,${fotoData.data.base64}`);
        } catch {
          console.log("No profile picture found, UserAvatar will display initials");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async (userData: UserProfile) => {
    try {
      const response = await axios.patch("/api/users", userData, { withCredentials: true });
      if (response.status === 201) {
        toast.success("Perfil atualizado com sucesso!", { duration: 1500 });
      } else {
        toast.error("Erro ao atualizar perfil", { duration: 2000 });
      }
    }
    catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil", { duration: 1500 });
    }

  }

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("imagem", file);

    try {
      const response = await fetch("/api/foto", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao enviar imagem");

      toast.success("Foto enviada com sucesso!", { duration: 2000 });

      // Refresh profile picture
      try {
        const imagemResponse = await fetch("/api/foto");
        const imagemData = await imagemResponse.json();
        setProfilePicture(`data:image/png;base64,${imagemData.base64}`);
        
        const newRefreshKey = avatarRefreshKey + 1;
        setAvatarRefreshKey(newRefreshKey);
        
        localStorage.setItem('avatarRefreshKey', newRefreshKey.toString());
        window.dispatchEvent(new Event('storage'));
        
      } catch (error) {
        console.error("Erro ao atualizar a foto após upload:", error);
      }
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
      toast.error("Erro ao enviar a foto", { duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 px-4 pb-8">
        <div className="w-full max-w-4xl relative">
          <button
            onClick={() => router.push("/projetos")}
            className="absolute left-0 md:left-4 text-3xl text-gray-700 hover:text-gray-900 top-[5px] md:top-[15px]"
          >
            &#60;
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <ProfilePicture 
                profilePicture={profilePicture}
                onPhotoUpload={handlePhotoUpload} 
                name={userData.name} 
                email={userData.email}
                userId={userData.id}
                refreshKey={avatarRefreshKey} 
              />
            </div>
            <div className="md:col-span-2">
              {isChangingPassword ? (
                <ChangePassword onBack={() => setIsChangingPassword(false)} />
              ) : (
                <ProfileForm
                  userData={userData}
                  onChange={(field, value) => setUserData((prev) => ({ ...prev, [field]: value }))}
                  onSave={() => updateProfile(userData)}
                  isSaving={isSaving}
                  onChangePassword={() => setIsChangingPassword(true)}
                />
              )}
            </div>
          </div>

          <Activities />
        </div>
      </div>
    </div>
  );
}
