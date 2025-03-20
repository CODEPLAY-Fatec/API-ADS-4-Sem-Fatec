"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import React from "react";
import GradientText from "./GradientText";

type ProjectDetailsProps = {
    project: {
        id: number;
        name: string;
        description: string;
        subject: string;
        institution: string;
        creator: number;
        status: "Fechado" | "Em andamento" | "Concluído";
    };
    onClose: () => void;
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
    return (
        <div className="absolute inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
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
                    <GradientText>Detalhes do Projeto</GradientText>
                </div>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" type="text" value={project.name} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" type="text" value={project.description} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="subject">Área de Atuação</Label>
                        <Input id="subject" type="text" value={project.subject} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="institution">Instituição</Label>
                        <Input id="institution" type="text" value={project.institution} readOnly className="w-full" />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Input id="status" type="text" value={project.status} readOnly className="w-full" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectDetails;
