"use client";
import axios from "axios";
import { User } from "@shared/User";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: User) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/users", formData);
            // fazer para redirecionar para login se criar usuario
        } catch (error) {
            console.error("Erro ao cadastrar o usuário", error);
        } finally {
            setLoading(false); // encerrar o carregamento
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
            });
        }
    };

    return (
        <div className="max-w-md mx-auto border border-black p-6 rounded-md">
            <h2 className="text-4xl font-black text-center mb-4">Cadastro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="phoneNumber">Número de telefone</Label>
                    <Input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
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
    );
};

export default RegisterForm;
