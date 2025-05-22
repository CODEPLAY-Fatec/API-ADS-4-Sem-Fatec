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
import UserAvatar from "./UserAvatar";

type TaskFormProps = {
  task: Task | null;
  projectMembers: User[];
  projectCreator: User;
  toggleForm: () => void;
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  setTaskUser: (task: Task, userId: number) => Promise<void>;
};

export default class TaskForm extends React.Component<
  TaskFormProps,
  { 
    task: Task;
    searchQuery: string;
    filteredUsers: User[];
    showDropdown: boolean;
    selectedUser: User | null;
  }
> {
  constructor(props: TaskFormProps) {
    super(props);
    
    const assignedUser = this.findAssignedUser(props);
    
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
      searchQuery: "",
      filteredUsers: [],
      showDropdown: false,
      selectedUser: assignedUser,
    };
  }
  
  findAssignedUser = (props: TaskFormProps): User | null => {
    const { task, projectMembers, projectCreator } = props;
    if (!task || !task.taskUser) return null;
    
    if (task.taskUser === projectCreator.id) {
      return projectCreator;
    }
    
    return projectMembers.find(member => member.id === task.taskUser) || null;
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

  handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });
    
    // Combinar criador do projeto e membros para busca
    const allUsers = [this.props.projectCreator, ...this.props.projectMembers];
    
    // Filtrar usuários baseado na consulta
    const filteredUsers = searchQuery 
      ? allUsers.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];
    
    this.setState({ 
      filteredUsers,
      showDropdown: true
    });
  };
  
  handleUserSelect = async (user: User) => {
    const userId = user.id;
    
    if (this.props.task) {
      await this.props.setTaskUser(this.state.task, userId);
    }
    
    this.setState(prevState => ({
      task: {
        ...prevState.task,
        taskUser: userId,
      },
      showDropdown: false,
      searchQuery: user.name,
      selectedUser: user
    }));
  };
  
  clearSelectedUser = () => {
    this.setState(prevState => ({
      task: {
        ...prevState.task,
        taskUser: undefined,
      },
      searchQuery: "",
      selectedUser: null
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
    const { task, searchQuery, filteredUsers, showDropdown, selectedUser } = this.state;

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
            <div className="relative">
              {selectedUser ? (
                <div className="flex items-center justify-between border rounded-md p-1 py-0.5 mb-2">
                  <UserAvatar 
                    userId={selectedUser.id}
                    name={selectedUser.name}
                    showName={true}
                    size="sm"
                    className="scale-90 transform-origin-left" // Adicionado escala para diminuir um pouco mais
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={this.clearSelectedUser}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    id="userSearch"
                    placeholder="Buscar membro por nome..."
                    value={searchQuery}
                    onChange={this.handleUserSearch}
                    onFocus={() => this.setState({ showDropdown: true })}
                    className="w-full"
                  />
                  
                  {showDropdown && filteredUsers.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 max-h-36 overflow-y-auto bg-white border rounded-md shadow-lg">
                      {filteredUsers.map(user => (
                        <div 
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => this.handleUserSelect(user)}
                        >
                          <UserAvatar 
                            userId={user.id}
                            name={user.name}
                            showName={true}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
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