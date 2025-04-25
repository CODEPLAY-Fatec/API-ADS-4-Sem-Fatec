"use client";

import Tabela from "@/components/Tabela";
import { Button } from "@/components/ui/button";
import GradientText from "@/created-components/GradientText";
import Navbar from "@/created-components/Navbar";
import ProjectDetails from "@/created-components/ProjectDetails";
import ProjectForm from "@/created-components/ProjectForm";
import Project from "@shared/Project";
import { User } from "@shared/User";
import { PlusIcon, XIcon } from "lucide-react";
import { useState, useRef } from "react";

type FetchedProject = Project & {
    creatorInfo: User;
    users: User[];
}

export default function Projetos() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FetchedProject | null>(null);
  const tabelaRef = useRef<{ fetchProjects: () => void } | null>(null);
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-col flex-grow px-4 py-8">
        <div className="w-full max-w-7xl pt-20 mx-auto">
          {selectedProject != null ? (
            <>
                <ProjectDetails projectId={selectedProject.id} closeSelectedProjectAction={() => setSelectedProject(null)}/>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 sticky top-4  py-4">
                <h1 className="text-3xl font-semibold ">Projetos</h1>
                <Button
                  className="rounded-full"
                  variant="outline"
                  size="icon"
                  aria-label="Add new item"
                  onClick={toggleForm}
                >
                  <PlusIcon size={16} aria-hidden="true" />
                </Button>
              </div>
              {showForm && (
                <>
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
                      <ProjectForm onSubmit={() => {
                          if (tabelaRef.current) {
                              tabelaRef.current.fetchProjects();
                          }
                      }} toggleForm={toggleForm} />
                    </div>
                  </div>
                </>
              )}
              <Tabela ref={tabelaRef} setSelectedProject={setSelectedProject} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
