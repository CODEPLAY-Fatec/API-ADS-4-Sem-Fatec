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

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await axios.post("/api/login", formData, { withCredentials: true });
      router.push("/projetos");
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <EmergeIn>
      <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg drop-shadow-[0_-5px_10px_rgba(0,0,0,0.1)]">
          <GradientText>É um prazer te ver novamente</GradientText>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 h-24 pr-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-center">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-3/4 bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 mx-auto block rounded-full transition-transform"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </EmergeIn>
  );
};

export default LoginForm;
