"use client";

import { Activities } from "@/created-components/Activities";
import { ChangePassword } from "@/created-components/ChangePassword";
import Navbar from "@/created-components/Navbar";
import { ProfileForm } from "@/created-components/ProfileForm";
import { ProfilePicture } from "@/created-components/ProfilePicture"; // Reintegrado
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfilePage() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        profilePicture: "",
    });

    const [isSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false); // Estado para alternar entre os componentes

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userRes, fotoRes] = await Promise.all([fetch("/api/me"), fetch("/api/foto")]);

                if (!userRes.ok || !fotoRes.ok) {
                    console.error("Erro ao buscar os dados do usuário ou imagem.");
                    return;
                }

                const userInfo = await userRes.json();
                const fotoData = await fotoRes.json();

                setUserData({
                    ...userInfo,
                    profilePicture: `data:image/png;base64,${fotoData.base64}`,
                });
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        fetchUserData();
    }, []);

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

            const imagemResponse = await fetch("/api/foto");
            const imagemData = await imagemResponse.json();

            setUserData((prev) => ({
                ...prev,
                profilePicture: `data:image/png;base64,${imagemData.base64}`,
            }));
        } catch (error) {
            console.error("Erro ao enviar a foto:", error);
            toast.error("Erro ao enviar a foto", { duration: 2000 });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 pb-10" style={{ marginTop: "140px" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <ProfilePicture profilePicture={userData.profilePicture} onPhotoUpload={handlePhotoUpload} name={userData.name} email={userData.email} />
                    {isChangingPassword ? (
                        <ChangePassword onBack={() => setIsChangingPassword(false)} />
                    ) : (
                        <ProfileForm
                            userData={userData}
                            onChange={(field, value) => setUserData((prev) => ({ ...prev, [field]: value }))}
                            onSave={() => console.log("Salvar alterações")}
                            isSaving={isSaving}
                            onChangePassword={() => setIsChangingPassword(true)}
                        />
                    )}
                </div>
                <Activities />
            </div>
        </div>
    );
}
