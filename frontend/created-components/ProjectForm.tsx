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

type state = {
  currentProject: Partial<Project>;
  projectSubjects: ProjectSubject[];
  institutions: Institution[];
  showSuccessModal: boolean;
};

export default class ProjectForm extends React.Component<{}, state> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentProject: {},
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
    if (!this.state.currentProject.name) {
      toast.error("Por favor, preencha o nome do projeto.",{duration: 1500});
      return;
    }
    if(!this.state.currentProject.subject){
      toast.error("Por favor, selecione uma área de atuação.",{duration: 1500});
      return;
    }
    if(!this.state.currentProject.institution){
      toast.error("Por favor, selecione uma instituição.",{duration: 1500});
      return;
    }
    if(!this.state.currentProject.status){
      toast.error("Por favor, selecione um status.",{duration: 1500});
      return;
    }
    if(!this.state.currentProject.description){
      toast.error("Por favor, preencha a descrição do projeto.",{duration: 1500});
      return;
    }

    
  
    const projectData: Project = {
      name: this.state.currentProject.name,
      description: this.state.currentProject.description,
      subject: this.state.currentProject.subject,
      status: this.state.currentProject.status,
      institution: this.state.currentProject.institution, 
      creator: 1,
    };
  
    try {
      await axios.post("/api/projects", projectData);
      this.setState({ 
        showSuccessModal: true,
        currentProject: {} 
      });
      document.body.style.overflow = "hidden"; 
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
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
      <div className="relative">
        {this.state.showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50">
              <p className="text-lg font-semibold text-black">Projeto criado com sucesso!</p>
              <Button
                onClick={this.closeSuccessModal}
                className="mt-4 bg-[#162b5e] text-white px-6 py-2 rounded-full hover:bg-[#0f224b] transition-transform duration-200"
              >
                OK
              </Button>
            </div>
          </div>
        )}

        <form
          onSubmit={this.submitForm}
          className="space-y-4 max-w-md mx-auto border border-gray-300 p-4 rounded-md bg-white z-10 relative"
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
              onChange={(e) => this.updateProjectData("subject", e.target.value)}
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
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
            </SelectNative>
          </div>

          <Button
            type="submit"
            className="rounded-full w-1/2 bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200 mx-auto block"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
