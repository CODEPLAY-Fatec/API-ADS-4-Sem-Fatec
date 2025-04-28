"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import axios from "axios";
import { TrashIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import GradientText from "./GradientText";
import toast from "react-hot-toast";
import { User } from "@shared/User";
import ProjectSubject from "@shared/ProjectSubject";
import Institution from "@shared/Institution";
import FetchedProject from "@/types/FetchedProject";
import { UserRoundX } from "lucide-react";

type ProjectEditorProps = {
  project: FetchedProject;
  setCurrentProject: (project: ProjectEditorProps["project"]) => void;
  onClose: (deleted: boolean) => void;
  users: User[];
  creator: User;
};

const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project,
  setCurrentProject,
  onClose,
  users,
  creator,
}) => {
  const [isEditable] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); // New state for delete success modal
  const [editableProject, setEditableProject] = useState(project);
  const [projectMembers, setProjectMembers] = useState<User[]>(users);
  const [projectSubjects, setProjectSubjects] = useState<
    ProjectSubject[] | undefined
  >();
  const [institutions, setInstitutions] = useState<Institution[] | undefined>();
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  // TODO: reimpmlementar a função de adicionar/remover membro
  // reimplementar instituições e áreas de atuação
  useEffect(() => {
    axios.get("/api/projects/subjects").then((response) => {
      setProjectSubjects(response.data);
    });
    axios.get("/api/projects/institutions").then((response) => {
      setInstitutions(response.data);
    });
  }, []);

  const handleSaveClick = async () => {
    try {
      await axios.patch("/api/projects", editableProject);
      toast.success("Atualizado com sucesso!", {duration: 1500});
      setCurrentProject(editableProject);
      onClose(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar projeto", { duration: 1500 });
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/projects/${project.id}`);
      toast.success("Deletado com sucesso!");
      onClose(true);
    } catch (error) {
      toast.error("Erro ao deletar projeto", { duration: 1500 });
      console.log(error)
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
          setProjectMembers((prev) =>
            prev.filter((member) => member.id !== Number(memberId)),
          );
          toast.success("Membro removido com sucesso!");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erro ao remover membro: " + error.response.data.message);
      });
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setEditableProject((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="absolute inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
      <div className="relative w-full max-w-2xl p-8 bg-white rounded-md shadow-lg max-h-[90vh] overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close Form"
          onClick={() => {onClose(false)}}
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
                <SelectNative
                  id="subject"
                  value={editableProject.subject || ""}
                  onChange={handleInputChange}
                  className="w-full"
                >
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
                <SelectNative
                  id="institution"
                  value={editableProject.institution || ""}
                  onChange={handleInputChange}
                  className="w-full"
                >
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
                <Label htmlFor="status">Status</Label>
                <SelectNative
                  id="status"
                  value={editableProject.status || ""}
                  onChange={handleInputChange}
                  className="w-full"
                >
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
                <Input
                  id="responsavel"
                  type="text"
                  value={creator.name}
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
                  <li
                    key={`member-${member.id}`}
                    className="flex justify-between items-center bg-white border border-gray rounded-lg mb-2"
                  >
                    <span className="pl-3">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(`${member.id}`)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  className="bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 px-6 py-3 rounded-full"
                  onClick={handleSaveClick}
                >
                  Salvar Edição
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 py-3 rounded-full"
                  onClick={handleDeleteClick}
                >
                  Excluir Projeto
                </Button>
              </div>
            </div>
          </form>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50 relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Modal"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
            >
              <XIcon size={16} />
            </Button>
            <div className="flex justify-center mb-4 items-center mt-2">
              <GradientText>Sucesso!</GradientText>
            </div>
            <p className="text-lg text-black mb-4">
              Projeto atualizado com sucesso!
            </p>
          </div>
        </div>
      )}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50 relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Modal"
              onClick={() => {
                setShowDeleteSuccessModal(false);
                onClose(true);
              }}
              className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
            >
              <XIcon size={16} />
            </Button>
            <div className="flex justify-center mb-4 items-center mt-2">
              <GradientText>Sucesso!</GradientText>
            </div>
            <p className="text-lg text-black mb-4">
              Projeto deletado com sucesso!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEditor;
