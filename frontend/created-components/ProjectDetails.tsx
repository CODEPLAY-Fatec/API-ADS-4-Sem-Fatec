"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react"; // Substitua pelo ícone da biblioteca que você está usando
import React from "react";

type ProjectDetailsProps = {
    project: {
        id: string;
        name: string;
        email: string;
        location: string;
        flag: string;
        status: string;
        balance: number;
    };
    onClose: () => void;
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
    return (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative w-full max-w-2xl p-8 bg-white rounded-md shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close Form"
                    onClick={onClose}
                    className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
                >
                    <XIcon size={20} />
                </Button>
                <div className="flex justify-center mb-4 items-center">
                    <h2 className="text-2xl font-semibold mb-4">Detalhes do Projeto</h2>
                </div>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" type="text" value={project.name} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={project.email} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="location">Área de Atuação</Label>
                        <Input id="location" type="text" value={project.location} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Input id="status" type="text" value={project.status} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="balance">Responsável</Label>
                        <Input id="balance" type="text" value={project.balance.toString()} readOnly className="w-full" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectDetails;
