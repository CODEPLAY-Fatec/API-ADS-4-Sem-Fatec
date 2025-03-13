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


type state = {
  currentProject: Partial<Project>;
  projectSubjects: ProjectSubject[];
};

export default class ProjectForm extends React.Component<{}, state> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentProject: {},
      projectSubjects: [],
    };
  }

  componentDidMount() {
    axios.get("/api/projects/subjects").then((response) => {
      this.setState({ projectSubjects: response.data });
    });
  }

  submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.state.currentProject.name) {
      return;
    }
    const projectData: Project = {
      name: this.state.currentProject.name,
      description: this.state.currentProject.description,
      subject: this.state.currentProject.subject,
      status: this.state.currentProject.status,
      creator: 1,
    };
    await axios.post("/api/projects", projectData);
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
      <form onSubmit={this.submitForm} className="space-y-4 max-w-md mx-auto border border-black p-4 rounded-md">
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
            onChange={(e) => this.updateProjectData("description", e.target.value)}
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
        
        <Button type="submit" className="rounded-full w-1/2 bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200 mx-auto block">
          Submit
        </Button>
      </form>
    );
  }
}
