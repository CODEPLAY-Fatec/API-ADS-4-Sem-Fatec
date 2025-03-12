"use client";
import React from "react";
import axios from "axios";
import Project from "@shared/Project";
import ProjectSubject from "@shared/ProjectSubject";

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
      <form onSubmit={this.submitForm}>
        Nome: 
        <input
          type="text"
          value={this.state.currentProject.name || ""}
          onChange={(e) => this.updateProjectData("name", e.target.value)}
        />
        <br />
        Descrição: 
        <input
          type="text"
          value={this.state.currentProject.description || ""}
          onChange={(e) =>
        this.updateProjectData("description", e.target.value)
          }
        />
        <br />
        Área de atuação: 
        <select
          value={this.state.currentProject.subject || ""}
          onChange={(e) => this.updateProjectData("subject", e.target.value)}
        >
          <option value="" disabled>
        Selecione uma área: 
          </option>
          {this.state.projectSubjects.map((subject) => (
        <option key={subject.name} value={subject.name}>
          {subject.name}
        </option>
          ))}
        </select>
        <br />
        Status: 
        <select
          value={this.state.currentProject.status || ""}
          onChange={(e) => this.updateProjectData("status", e.target.value)}
        >
          <option value="" disabled>
        Selecione um status: 
          </option>
          <option value="Fechado">Fechado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
        </select>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
