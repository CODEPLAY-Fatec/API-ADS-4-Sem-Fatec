"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import FetchedProject from "@/types/FetchedProject";
import Institution from "@shared/Institution";
import ProjectSubject from "@shared/ProjectSubject";
import { User } from "@shared/User";
import axios from "axios";
import { TrashIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GradientText from "./GradientText";
import UserAvatar from "./UserAvatar";

type ProjectEditorProps = {
    project: FetchedProject;
    setCurrentProject: (project: ProjectEditorProps["project"]) => void;
    onClose: (deleted: boolean) => void;
    users: User[];
    setProjectMembers: React.Dispatch<React.SetStateAction<User[]>>;
    creator: User;
};

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, setCurrentProject, onClose, users, setProjectMembers, creator }) => {
    const [isEditable] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); // New state for delete success modal
    const [editableProject, setEditableProject] = useState(project);
    const projectMembers = users;
    const [projectSubjects, setProjectSubjects] = useState<ProjectSubject[] | undefined>();
    const [institutions, setInstitutions] = useState<Institution[] | undefined>();
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    // TODO: reimpmlementar a função de adicionar/remover membro
    // reimplementar instituições e áreas de atuação
    useEffect(() => {
        axios.get("/api/projects/subjects").then((response) => {
            setProjectSubjects(response.data);
        });
        axios.get("/api/projects/institutions").then((response) => {
            setInstitutions(response.data);
        });
        axios.get("/api/me").then((response) => {
            setLoggedUser(response.data);
        });
    }, []);

    const handleSaveClick = async () => {
    try {
        const { start, finish } = editableProject;

        if (start && finish && new Date(start) > new Date(finish)) {
            toast.error("A data de início não pode ser superior à data de término.", {
                duration: 1500,
            });
            return;
        }

        if (start && finish && new Date(finish) < new Date(start)) {
            toast.error("A data de término não pode ser inferior à data de início.", {
                duration: 1500,
            });
            return;
        }

        const formattedProject = {
            ...editableProject,
            start: editableProject.start ? new Date(editableProject.start).toISOString() : undefined,
            finish: editableProject.finish ? new Date(editableProject.finish).toISOString() : undefined,
        };

        console.log("Dados enviados para o backend:", formattedProject);
        await axios.patch("/api/projects", formattedProject);

        toast.success("Projeto atualizado com sucesso!", { duration: 1500 });
        setCurrentProject(editableProject);
        onClose(false);
    } catch (error) {
        console.log("Erro ao adicionar tarefa:", error);
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.message || "Erro ao adicionar tarefa");
        } else {
            toast.error("Erro ao adicionar tarefa");
        }
    }
};

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`/api/projects/${project.id}`);
            toast.success("Deletado com sucesso!");
            onClose(true);
        } catch (error) {
            toast.error("Erro ao deletar projeto", { duration: 1500 });
            console.log(error);
        }
    };

    const handleAddMember = async (email: string) => {
        axios
            .post(`/api/projects/${editableProject.id}/user`, { user: email })
            .then((response) => {
                if (response.status === 201) {
                    setProjectMembers((prev) => [...prev, response.data.user]);
                    setNewMemberEmail("");
                    toast.success("Membro adicionado com sucesso!");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Erro ao adicionar membro: " + error.response.data.message);
            });
    };

    async function handleRemoveMember(memberId: string) {
        axios
            .delete(`/api/projects/${editableProject.id}/user/${memberId}`)
            .then((response) => {
                if (response.status === 201) {
                    setProjectMembers((prev) => prev.filter((member) => member.id !== Number(memberId)));
                    toast.success("Membro removido com sucesso!");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Erro ao remover membro: " + error.response.data.message);
            });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEditableProject((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div className="relative w-full max-w-2xl p-8 bg-white rounded-md shadow-lg max-h-[90vh] overflow-y-auto">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Close Form"
                onClick={() => {
                    onClose(false);
                }}
                className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
            >
                <XIcon size={20} />
            </Button>
            <div className="flex justify-center mb-4 items-center">
                <GradientText>Detalhes do Projeto</GradientText>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" type="text" value={editableProject.name || ""} readOnly={!isEditable} onChange={handleInputChange} className="w-full" />
                </div>

                <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                        id="description"
                        type="text"
                        value={editableProject.description || ""}
                        readOnly={!isEditable}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <Label htmlFor="subject">Área de Atuação</Label>
                        <SelectNative id="subject" value={editableProject.subject || ""} onChange={handleInputChange} className="w-full">
                            <option value="" disabled>
                                Selecione uma área
                            </option>
                            {projectSubjects?.map((subject) => (
                                <option key={subject.name} value={subject.name}>
                                    {subject.name}
                                </option>
                            ))}
                        </SelectNative>
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="institution">Instituição</Label>
                        <SelectNative id="institution" value={editableProject.institution || ""} onChange={handleInputChange} className="w-full">
                            <option value="" disabled>
                                Selecione uma instituição
                            </option>
                            {institutions?.map((institution) => (
                                <option key={institution.name} value={institution.name}>
                                    {institution.name}
                                </option>
                            ))}
                        </SelectNative>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <Label htmlFor="start">Data de Início</Label>
                        <Input
                            id="start"
                            type="date"
                            value={new Date(editableProject.start!).toISOString().split("T")[0] || ""}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="finish">Data de Término</Label>
                        <Input
                            id="finish"
                            type="date"
                            value={new Date(editableProject.finish!).toISOString().split("T")[0] || ""}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <Label htmlFor="status">Status</Label>
                        <SelectNative id="status" value={editableProject.status || ""} onChange={handleInputChange} className="w-full">
                            <option value="" disabled>
                                Selecione um status
                            </option>
                            <option value="Fechado">Fechado</option>
                            <option value="Em_andamento">Em andamento</option>
                            <option value="Concluido">Concluído</option>
                        </SelectNative>
                    </div>

                    <div className="w-1/2">
                        <Label htmlFor="responsavel">Responsável</Label>
                        <Input id="responsavel" type="text" value={creator.name} readOnly className="w-full" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="addMember">Adicionar Membro por Email</Label>
                    <Input
                        id="addMember"
                        type="email"
                        placeholder="Digite o email e pressione Enter"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && newMemberEmail) {
                                e.preventDefault();
                                handleAddMember(newMemberEmail);
                                setNewMemberEmail("");
                            }
                        }}
                        className="w-full mb-2"
                    />

                    <Label htmlFor="members">Membros Atuais</Label>
                    <ul className="list-group mb-3">
                        {projectMembers.map((member) => (
                            <li key={`member-${member.id}`} className="flex justify-between items-center bg-white border border-gray rounded-lg mb-1 py-1">
                                <div className="pl-3">
                                    <UserAvatar userId={member.id} name={member.name} showName={true} size="sm" />
                                </div>
                                { loggedUser?.id === creator.id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveMember(`${member.id}`)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <TrashIcon size={16} />
                                </Button>
                                )}
                                
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center space-x-4 mt-6">
                        <Button className="bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 px-6 py-3 rounded-full" onClick={handleSaveClick}>
                            Salvar Edição
                        </Button>
                        
                        {loggedUser?.id === creator.id && (
                        <Button className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 py-3 rounded-full" onClick={handleDeleteClick}>
                            Excluir Projeto
                        </Button>
                    )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectEditor;
