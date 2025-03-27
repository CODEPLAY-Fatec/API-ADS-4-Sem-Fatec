"use client";

import Tabela from "@/components/comp-483";
import { Button } from "@/components/ui/button";
import GradientText from "@/created-components/GradientText";
import Navbar from "@/created-components/Navbar";
import ProjectForm from "@/created-components/ProjectForm";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Notificação feedback

export default function Projetos() {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <div className="flex flex-col flex-grow px-4 py-8">
                <div className="w-full max-w-7xl pt-20 mx-auto">
                    <div className="flex justify-between items-center mb-6 sticky top-4 z-10 py-4">
                        <h1 className="text-3xl font-semibold">Projetos</h1>
                        <Button className="rounded-full" variant="outline" size="icon" aria-label="Add new item" onClick={toggleForm}>
                            <PlusIcon size={16} aria-hidden="true" />
                        </Button>
                    </div>
                    {showForm && (
                        <div className="absolute inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
                            <div className="relative w-full max-w-2xl p-8 bg-white rounded-md shadow-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Close Form"
                                    onClick={toggleForm}
                                    className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
                                >
                                    <XIcon size={20} />
                                </Button>
                                <div className="flex justify-center mb-4 items-center">
                                    <GradientText>Criar Novo Projeto</GradientText>
                                </div>
                                <ProjectForm />
                            </div>
                        </div>
                    )}
                    <Tabela />
                </div>
            </div>
        </div>
    );
}

export const useToast = () => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
});
