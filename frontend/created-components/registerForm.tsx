"use client";
import axios from "axios";
import { User } from "@shared/User";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GradientText from "./GradientText";
import EmergeIn from "./EmergeIn";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast"; 

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
            toast.error("Por favor, preencha todos os campos.",{duration: 1500});
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/users", formData, { withCredentials: true });
            toast.success("Cadastro realizado com sucesso!"); 
            router.push("/login");
            setFormData({       
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
            });
        } catch (error) {
           
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message,{duration: 1500});
            } else {
                toast.error("Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false);
            
        }
    };

    return (
        <EmergeIn>
            <div className="relative flex min-h-screen items-center justify-center px-6">
                <button
                    onClick={() => router.push("/")}
                    className="absolute top-8 left-8 text-3xl text-gray-700 hover:text-gray-900"
                >
                    &#60;
                </button>
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <GradientText>Crie sua conta</GradientText>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-gray-700">Nome</Label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber" className="text-gray-700">Número de telefone</Label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                            />
                        </div>

                        <div className="relative">
                            <Label htmlFor="password" className="text-gray-700">Senha</Label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 h-24 pr-2"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="text-center">
                            <a href="/login" className="text-sm text-blue-500 hover:underline">
                                Já tem uma conta? Entre aqui
                            </a>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-3/4 bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 mx-auto block rounded-full transition-transform"
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </form>
                </div>
            </div>
        </EmergeIn>
    );
};

export default RegisterForm;
