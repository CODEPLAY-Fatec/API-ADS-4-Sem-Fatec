"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react"; 
import ProjectForm from "@/created-components/ProjectForm"; 

export default function Component2() {
  const [showForm, setShowForm] = useState(false); 

  const toggleForm = () => {
    setShowForm(!showForm); 
  };

  return (
    <div>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        aria-label="Add new item"
        onClick={toggleForm}
      >
        <PlusIcon size={16} aria-hidden="true" />
      </Button>

      {showForm && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
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
            <ProjectForm />
          </div>
        </div>
      )}
    </div>
  );
}
