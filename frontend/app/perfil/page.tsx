"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/created-components/Navbar";
import { ProfilePicture } from "@/created-components/ProfilePicture";
import { ProfileForm } from "@/created-components/ProfileForm";
import { Activities } from "@/created-components/Activities";

export default function UserProfilePage() {
  const [lastAccess, setLastAccess] = useState<string>("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    linkedin: "",
    profilePicture: "https://via.placeholder.com/120",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setLastAccess(data.lastAccess);
        } else {
          console.error("Erro ao buscar os dados do usuário.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Perfil atualizado!");
      } else {
        alert("Erro ao salvar.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await fetch("/api/user/upload-photo", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUserData((prev) => ({ ...prev, profilePicture: data.profilePicture }));
          alert("Foto atualizada com sucesso!");
        } else {
          alert("Erro ao atualizar a foto.");
        }
      } catch (error) {
        console.error("Erro ao enviar a foto:", error);
        alert("Erro ao enviar a foto.");
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pb-10" style={{ marginTop: "140px" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ProfilePicture
            profilePicture={userData.profilePicture}
            name={userData.name}
            email={userData.email}
            onPhotoUpload={handlePhotoUpload}
          />
          <ProfileForm
            userData={userData}
            onChange={handleChange}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
        <Activities />
      </div>
    </div>
  );
}