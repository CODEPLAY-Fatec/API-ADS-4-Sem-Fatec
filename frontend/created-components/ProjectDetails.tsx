"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import axios from "axios";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import GradientText from "./GradientText";
import toast from "react-hot-toast"; 
import Project from "@shared/Project";

type ProjectDetailsProps = {
    project: Project & { member_ids: number[], member_names: string[], member_emails: string[] };
    onClose: () => void;
    users: { id: number; name: string }[];
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, users }) => {
    const [isEditable] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); // New state for delete success modal
    const [editableProject, setEditableProject] = useState({ ...project });
    const [projectSubjects, setProjectSubjects] = useState<string[]>([]);
    const [institutions, setInstitutions] = useState<string[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>('');


    useEffect(() => {
        const fetchProjectSubjects = async () => {
            try {
                const response = await axios.get("/api/projects/subjects");
                setProjectSubjects(response.data.map((subject: { name: string }) => subject.name));
            } catch (error) {
                toast.error("Erro ao buscaráreas de atuação",{duration: 1500});
            }
        };

        const fetchInstitutions = async () => {
            try {
                const response = await axios.get("/api/projects/institutions");
                setInstitutions(response.data.map((institution: { name: string }) => institution.name));
            } catch (error) {
                toast.error("Erro ao buscar instituições",{duration: 1500});
            }
        };

        fetchProjectSubjects();
        fetchInstitutions();
    }, []);

    const getResponsavelName = (creatorId: number) => {
        const user = users.find((user) => user.id === creatorId);
        return user ? user.name : "Desconhecido";
    };

    const handleSaveClick = async () => {
        try {
            await axios.patch("/api/projects", editableProject);
            toast.success("Aualizado com sucesso!"), {duration: 1500}; 
            onClose();
        } catch (error) {
            console.error(error)
            toast.error("Erro ao atualizar projeto",{duration: 1500});
        }
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`/api/projects/${project.id}`);
            toast.success("Deletado com sucesso!"); 
            onClose();
        } catch (error) {
            toast.error("Erro ao deletar projeto", {duration: 1500}); 
        }
    };

    const handleAddMember = async (email: string) => {
        try {
            await axios.post(`/api/projects/${project.id}/user`, { user: email });
            const newProject = await axios.get(`/api/projects/${project.id}`);
            setEditableProject({ 
                ...editableProject, 
                member_ids: newProject.data.member_ids, 
                member_names: newProject.data.member_names, 
                member_emails: newProject.data.member_emails 
            });
            toast.success("Membro adicionado com sucesso!", {duration: 1500});
        } catch (error) {
            toast.error("Erro ao adicionar membro", {duration: 1500});
            console.error(error)
        }

    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEditableProject((prev) => ({ ...prev, [id]: value }));
    };

    async function handleRemoveMember(memberId: string) {
        console.log(memberId)
        try {
            await axios.delete(`/api/projects/${project.id}/${memberId}`);
            toast.success("Membro removido com sucesso!", {duration: 1500});
            const userIndex = editableProject.member_ids.indexOf(Number(memberId));
            editableProject.member_ids = editableProject.member_ids.filter((id) => id !== Number(memberId));
            editableProject.member_names = editableProject.member_names.filter((_name, index) => index !== userIndex); 
            editableProject.member_emails = editableProject.member_emails.filter((_email, index) => index !== userIndex);
            setEditableProject({ ...editableProject });
        } catch (error) {
            toast.error("Erro ao remover membro", {duration: 1500});
        }
    }

    function getMemberName(memberId: number) {
        return editableProject.member_names.find((_name, index) => editableProject.member_ids[index] === memberId);
    }

    function getMemberEmail(memberId: number) {
        return editableProject.member_emails.find((_email, index) => editableProject.member_ids[index] === memberId);
    }

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
                <div className="border-2 border-gray-300 rounded-xl p-6">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                value={editableProject.name || ""}
                                readOnly={!isEditable}
                                onChange={handleInputChange}
                                className="w-full"
                            />
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
                                    {projectSubjects.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
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
                                    {institutions.map((institution) => (
                                        <option key={institution} value={institution}>
                                            {institution}
                                        </option>
                                    ))}
                                </SelectNative>
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
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Concluído">Concluído</option>
                                </SelectNative>
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="responsavel">Responsável</Label>
                                <Input 
                                    id="responsavel" 
                                    type="text" 
                                    value={getResponsavelName(editableProject.creator)} 
                                    readOnly 
                                    className="w-full" 
                                />
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
                              if (e.key === 'Enter' && newMemberEmail) {
                                e.preventDefault()
                                handleAddMember(newMemberEmail);
                                setNewMemberEmail('');
                              }
                            }}
                            className="w-full mb-2"
                          />
                          
                          <Label htmlFor="members">Membros Atuais</Label>
                          <SelectNative
                            id="members"
                            value=""
                            onChange={(e) => {
                              const memberId = e.target.value;
                              if (memberId) handleRemoveMember(memberId);
                            }}
                            className="w-full cursor-pointer"
                          >
                            <option value="" disabled>
                              Clique em um membro para removê-lo
                            </option>
                            {editableProject.member_ids?.map((memberId) => (
                              <option key={memberId} value={memberId}>
                                {getMemberEmail(memberId)} {/* Changed to email display */}
                              </option>
                            ))}
                          </SelectNative>
                          <div className="flex justify-center space-x-4 mt-6">
                              <Button className="bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 px-6 py-3 rounded-full" onClick={handleSaveClick}>
                                  Salvar Edição
                              </Button>
                              <Button className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 py-3 rounded-full" onClick={handleDeleteClick}>
                                  Excluir Projeto
                              </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50">
                        <p className="text-lg font-semibold text-black">Projeto atualizado com sucesso!</p>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="mt-4 bg-[#162b5e] text-white px-6 py-2 rounded-full hover:bg-[#0f224b] transition-transform duration-200"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
            {showDeleteSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50">
                        <p className="text-lg font-semibold text-black">Projeto deletado com sucesso!</p>
                        <Button
                            onClick={() => {
                                setShowDeleteSuccessModal(false);
                                onClose();
                            }}
                            className="mt-4 bg-[#162b5e] text-white px-6 py-2 rounded-full hover:bg-[#0f224b] transition-transform duration-200"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
