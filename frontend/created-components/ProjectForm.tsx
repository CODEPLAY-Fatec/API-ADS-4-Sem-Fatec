"use client";
import React from "react";
import axios from "axios";
import Project from "@shared/Project";
import ProjectSubject from "@shared/ProjectSubject";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import Institution from "@shared/Institution";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";
import GradientText from "./GradientText";

type ProjectFormState = {
  currentProject: Partial<Project>;
  projectSubjects: ProjectSubject[];
  institutions: Institution[];
  showSuccessModal: boolean;
};

type ProjectFormProperties = {
  onSubmit: () => void;
  toggleForm: () => void;
};

export default class ProjectForm extends React.Component<
  ProjectFormProperties,
  ProjectFormState
> {
  constructor(props: ProjectFormProperties) {
    super(props);

    // Obtém a data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Calcula a data de término (15 dias após a data atual)
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 15);
    const fifteenDaysLater = defaultEndDate.toISOString().split("T")[0];

    this.state = {
      currentProject: {
        start: today, // Data de início pré-definida como hoje
        finish: fifteenDaysLater, // Data de término pré-definida como 15 dias depois
      },
      projectSubjects: [],
      institutions: [],
      showSuccessModal: false,
    };
  }

  componentDidMount() {
    axios
      .get("/api/projects/subjects", { withCredentials: true })
      .then((response) => {
        this.setState({ projectSubjects: response.data });
      });
    axios
      .get("/api/projects/institutions", { withCredentials: true })
      .then((response) => {
        this.setState({ institutions: response.data });
      });
  }

submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const { start, finish } = this.state.currentProject;

  // Validação: Data de Início não pode ser maior que a Data de Término
  if (start && finish && new Date(start) > new Date(finish)) {
    toast.error("A data de início não pode ser superior à data de término.", {
      duration: 1500,
    });
    return;
  }

  // Validação: Data de Término não pode ser menor que a Data de Início
  if (start && finish && new Date(finish) < new Date(start)) {
    toast.error("A data de término não pode ser inferior à data de início.", {
      duration: 1500,
    });
    return;
  }

  if (!this.state.currentProject.name) {
    toast.error("Por favor, preencha o nome do projeto.", { duration: 1500 });
    return;
  }
  if (!this.state.currentProject.subject) {
    toast.error("Por favor, selecione uma área de atuação.", {
      duration: 1500,
    });
    return;
  }
  if (!this.state.currentProject.institution) {
    toast.error("Por favor, selecione uma instituição.", { duration: 1500 });
    return;
  }
  if (!this.state.currentProject.status) {
    toast.error("Por favor, selecione um status.", { duration: 1500 });
    return;
  }
  if (!this.state.currentProject.description) {
    toast.error("Por favor, preencha a descrição do projeto.", {
      duration: 1500,
    });
    return;
  }

  const projectData: Project = {
    id: 0,
    name: this.state.currentProject.name,
    description: this.state.currentProject.description,
    subject: this.state.currentProject.subject,
    status: this.state.currentProject.status,
    institution: this.state.currentProject.institution,
    start: this.state.currentProject.start,
    finish: this.state.currentProject.finish,
    creator: 1,
  };

  try {
    await axios.post("/api/projects", projectData);
    toast.success("Projeto criado com sucesso!");
    this.props.toggleForm();
    this.props.onSubmit();
  } catch (error) {
    toast.error("Erro ao criar Projeto", { duration: 1500 });
    console.warn(error);
  }
};

  closeSuccessModal = () => {
    this.setState({ showSuccessModal: false }, () => {
      document.body.style.overflow = "auto";
    });
  };

  updateProjectData = (key: string, value: string) => {
    this.setState((prevState) => ({
      currentProject: {
        ...prevState.currentProject,
        [key]: value,
      },
    }));
  };

  render() {
    return (
      <>
        {this.state.showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50 relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close Modal"
                onClick={this.closeSuccessModal}
                className="absolute top-2 right-2 p-0 text-gray-600 hover:text-gray-800"
              >
                <XIcon size={16} />
              </Button>
              <div className="flex justify-center mb-4 items-center mt-2">
                <GradientText>Sucesso!</GradientText>
              </div>
              <p className="text-lg text-black mb-4">
                Projeto criado com sucesso!
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={this.submitForm}
          className="space-y-4 rounded-md bg-white z-10 relative"
        >
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={this.state.currentProject.name || ""}
              onChange={(e) => this.updateProjectData("name", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={this.state.currentProject.description || ""}
              onChange={(e) =>
                this.updateProjectData("description", e.target.value)
              }
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="subject">Área de atuação</Label>
            <SelectNative
              id="subject"
              value={this.state.currentProject.subject || ""}
              onChange={(e) =>
                this.updateProjectData("subject", e.target.value)
              }
              className="w-full"
            >
              <option value="" disabled>
                Selecione uma área
              </option>
              {this.state.projectSubjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </SelectNative>
          </div>

          <div>
            <Label htmlFor="institution">Instituição</Label>
            <SelectNative
              id="institution"
              value={this.state.currentProject.institution || ""}
              onChange={(e) =>
                this.updateProjectData("institution", e.target.value)
              }
              className="w-full"
            >
              <option value="" disabled>
                Selecione uma instituição
              </option>
              {this.state.institutions.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="start">Data de Início</Label>
              <Input
                id="start"
                type="date"
                value={this.state.currentProject.start || ""}
                onChange={(e) => this.updateProjectData("start", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="w-1/2">
              <Label htmlFor="finish">Data de Término</Label>
              <Input
                id="finish"
                type="date"
                value={this.state.currentProject.finish || ""}
                onChange={(e) => this.updateProjectData("finish", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <SelectNative
              id="status"
              value={this.state.currentProject.status || ""}
              onChange={(e) => this.updateProjectData("status", e.target.value)}
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

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="rounded-full w-1/2 bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200"
            >
              Criar
            </Button>
          </div>
        </form>
      </>
    );
  }
}
