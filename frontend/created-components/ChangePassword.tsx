import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChangePasswordProps {
    onBack: () => void; // Função para voltar ao ProfileForm
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/users/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Inclui cookies na requisição
                body: JSON.stringify({
                    password: currentPassword,
                    newpassword: newPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao alterar a senha.");
            }

            toast.success("Senha alterada com sucesso!");
            onBack(); // Voltar ao formulário de perfil
        } catch (error: any) {
            // Exiba a mensagem de erro retornada pelo backend
            const errorMessage = error.message || "Erro ao alterar a senha.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-2 rounded-xl shadow bg-white p-4">
            <h2 className="text-base font-semibold mb-3">Alterar Senha</h2>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </div>
            </div>
            <div className="flex gap-3 mt-3">
                <Button className="flex-1 bg-blue-500 text-white" onClick={handleChangePassword} disabled={isSubmitting}>
                    {isSubmitting ? "Alterando..." : "Alterar Senha"}
                </Button>
                <Button className="flex-1 bg-gray-300 text-black" onClick={onBack} disabled={isSubmitting}>
                    Voltar
                </Button>
            </div>
        </div>
    );
};
