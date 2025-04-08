"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/created-components/Navbar";
import { ProfilePicture } from "@/created-components/ProfilePicture";
import { ProfileForm } from "@/created-components/ProfileForm";
import { Activities } from "@/created-components/Activities";

export default function UserProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    linkedin: "",
    profilePicture: "https://via.placeholder.com/120", // Imagem padrão
  });

  const [isSaving, setIsSaving] = useState(false);

  // Busca os dados do usuário, incluindo a foto de perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile"); // Endpoint para buscar os dados do usuário
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Erro ao buscar os dados do usuário.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchUserData();
  }, []);

  // Função para enviar a foto ao backend
  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch("/api/user/foto", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserData((prev) => ({ ...prev, profilePicture: data.profilePicture })); // Atualiza a URL da foto no estado
        alert("Foto atualizada com sucesso!");
      } else {
        alert("Erro ao atualizar a foto.");
      }
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
      alert("Erro ao enviar a foto.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pb-10" style={{ marginTop: "140px" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Componente de foto de perfil */}
          <ProfilePicture
            profilePicture={userData.profilePicture}
            name={userData.name}
            email={userData.email}
            onPhotoUpload={handlePhotoUpload}
          />
          {/* Formulário de informações do usuário */}
          <ProfileForm
            userData={userData}
            onChange={(field, value) =>
              setUserData((prev) => ({ ...prev, [field]: value }))
            }
            onSave={() => console.log("Salvar alterações")}
            isSaving={isSaving}
          />
        </div>
        {/* Componente de atividades */}
        <Activities />
      </div>
    </div>
  );
}