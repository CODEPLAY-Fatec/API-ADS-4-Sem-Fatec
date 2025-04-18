"use client";
import React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Task from "@shared/Task";
import { SelectNative } from "@/components/ui/select-native";

type TaskFormProps = {
  task: Task | null;
  toggleForm: () => void;
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
};

export default class TaskForm extends React.Component<
  TaskFormProps,
  { task: Task; showSuccessModal: boolean }
> {
  constructor(props: TaskFormProps) {
    super(props);
    this.state = {
      task: {
        id: props.task ? props.task.id : Date.now(),
        title: props.task ? props.task.title : "",
        description: props.task ? props.task.description : "",
        start: props.task ? props.task.start : new Date(),
        finish: props.task ? props.task.finish : new Date(),
        status: props.task ? props.task.status : "Fechado",
      },
      showSuccessModal: false,
    };
  }

  handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    this.setState((prevState: any) => ({
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
      this.props.addTask(task);
      toast.success("Tarefa criada com sucesso!");
      this.props.toggleForm();
    } catch (error) {
      toast.error("Ocorreu um erro ao criar a tarefa.");
    }
  };

  closeSuccessModal = () => {
    this.setState({ showSuccessModal: false }, () => {
      document.body.style.overflow = "auto";
    });
  };

  render() {
    const { task } = this.state;

    return (
      <div className="relative">
        {this.state.showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50">
              <p className="text-lg font-semibold text-black">
                Tarefa criada com sucesso!
              </p>
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
              <option value="Concluído">Concluído</option>
            </SelectNative>
          </div>

          <Button
            type="submit"
            className="bg-[#162b5e] text-white px-6 py-2 rounded-full hover:bg-[#0f224b] transition-transform duration-200"
          >
            {this.props.task ? "Atualizar Tarefa" : "Criar Tarefa"}
          </Button>
          <Button
            type="button"
            onClick={this.props.toggleForm}
            className="bg-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-400 transition-transform duration-200"
          >
            Cancelar
          </Button>
          {this.props.task && (
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                this.props.deleteTask(task);
                this.props.toggleForm();
              }}
            >
              Deletar tarefa
            </Button>
          )}
        </form>
      </div>
    );
  }
}
