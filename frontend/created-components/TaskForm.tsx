"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Task from "@shared/Task";
import { SelectNative } from "@/components/ui/select-native";
import { User } from "@shared/User";

type TaskFormProps = {
  task: Task | null;
  projectMembers: User[];
  projectCreator: User;
  projectStart: string;
  projectFinish: string;
  toggleForm: () => void;
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  setTaskUser: (task: Task, userId: number) => Promise<void>;
};

export default class TaskForm extends React.Component<
  TaskFormProps,
  { task: Task } // Removido showSuccessModal
> {
  constructor(props: TaskFormProps) {
    super(props);
    this.state = {
      task: {
        ...props.task,
        id: props.task ? props.task.id : Date.now(),
        title: props.task ? props.task.title : "",
        description: props.task ? props.task.description : "",
        start: props.task ? props.task.start : new Date(),
        finish: props.task ? props.task.finish : new Date(),
        status: props.task ? props.task.status : "Fechado",
      },
    };
  }

  handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      task: {
        ...prevState.task,
        [name]: value,
      },
    }));
  };

  submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { task } = this.state;
    if (!task.title || !task.description || !task.status) {
      toast.error("Por favor, preencha todos os campos.", { duration: 1500 });
      return;
    }

    try {
      await this.props.addTask(task);
      this.props.toggleForm(); // Fecha o formulário diretamente
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar tarefa");
    }
  };

  render() {
    const task = this.state.task;

    return (
      <div className="relative">
        <form
          onSubmit={this.submitForm}
          className="space-y-4 rounded-md bg-white z-10 relative"
        >
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={task.title}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={task.description}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="start">Data de Início</Label>
            <Input
              id="start"
              name="start"
              type="date"
              value={task.start ? task.start.toISOString().split("T")[0] : ""}
              min={this.props.projectStart} // Limite mínimo: Data de início do projeto
              max={this.props.projectFinish} // Limite máximo: Data de término do projeto
              onChange={(e) => {
                const dateString = e.target.value;
                const date = new Date(dateString + "T00:00:00");
                this.setState((prevState) => ({
                  task: {
                    ...prevState.task,
                    start: date,
                  },
                }));
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="finish">Data de Término</Label>
            <Input
              id="finish"
              name="finish"
              type="date"
              value={task.finish ? task.finish.toISOString().split("T")[0] : ""}
              min={this.props.projectStart} // Limite mínimo: Data de início do projeto
              max={this.props.projectFinish} // Limite máximo: Data de término do projeto
              onChange={(e) => {
                const dateString = e.target.value;
                const date = new Date(dateString + "T00:00:00");
                this.setState((prevState) => ({
                  task: {
                    ...prevState.task,
                    finish: date,
                  },
                }));
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <SelectNative
              id="status"
              name="status"
              value={task.status || ""}
              onChange={this.handleChange}
              className="w-full"
            >
              <option value="Fechado">Fechado</option>
              <option value="Em_andamento">Em andamento</option>
              <option value="Concluido">Concluído</option>
            </SelectNative>
          </div>

          <div>
            <Label htmlFor="taskUser">Atribuir a</Label>
            <SelectNative
              id="taskUser"
              name="taskUser"
              value={
                this.props.projectMembers.find((u: User) => {
                  if (u.id == this.state.task.taskUser) {
                    return u;
                  }
                })?.id ||
                (this.state.task.taskUser == this.props.projectCreator.id &&
                  this.props.projectCreator.id) ||
                ""
              }
              onChange={async (e) => {
                const userId = parseInt(e.target.value);
                if (this.props.task) {
                  await this.props.setTaskUser(task, userId);
                }
                this.setState((prevState) => ({
                  task: {
                    ...prevState.task,
                    taskUser: userId,
                  },
                }));
              }}
              className="w-full"
            >
              <option value="">Não atribuir</option>
              <option
                key={this.props.projectCreator.id}
                value={this.props.projectCreator.id}
              >
                {this.props.projectCreator.name}
              </option>
              {this.props.projectMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </SelectNative>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button
              type="submit"
              className="bg-[#162b5e] text-white px-6 py-2 rounded-full hover:bg-[#0f224b] transition-transform duration-200"
            >
              {this.props.task ? "Atualizar Tarefa" : "Criar Tarefa"}
            </Button>
            {this.props.task && (
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  this.props.deleteTask(task);
                  this.props.toggleForm();
                }}
                className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 py-2 rounded-full"
              >
                Deletar Tarefa
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
}