"use client";
import axios from "axios";
import { User } from "@shared/User";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; 
import GradientText from "./GradientText";
import FadeIn from "./FadeIn";
import EmergeIn from "./EmergeIn";

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/users", formData);
            // Redirecionar para a tela de login após sucesso
            router.push("/login");
        } catch (error) {
            console.error("Erro ao cadastrar o usuário", error);
        } finally {
            setLoading(false);
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
            });
        }
    };

    return (
        <EmergeIn>
                        <div className="flex min-h-screen items-center justify-center px-6">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="absolute left-4 top-4 p-2"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            stroke="currentColor"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.1),_0px_-4px_10px_rgba(0,0,0,0.1)]">
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

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</Label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                            />
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
