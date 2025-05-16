"use client";
import axios from "axios";
import { User } from "@shared/User";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GradientText from "./GradientText";
import EmergeIn from "./EmergeIn";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ id: 0, name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const [canResendCode, setCanResendCode] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === 2 && !canResendCode && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            setCanResendCode(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, canResendCode, resendCountdown]);

  useEffect(() => {
    if (!isRecoveryOpen) {
      setSendButtonDisabled(false);
      setCanResendCode(false);
      setResendCountdown(60);
    }
  }, [isRecoveryOpen]);

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
      console.log("Erro no login:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro inesperado.");
      }
    } finally {
      setLoading(false);
      
    }
  };

  const handleRecoverySubmit = async () => {
    try {
      if (step === 1) {
        if (!recoveryEmail) {
          toast.error("Por favor, insira um e-mail válido.");
          return;
        }
        
        setSendButtonDisabled(true);
        
        await axios.post("/api/password-recovery/request-code", { email: recoveryEmail }, { withCredentials: true });
        setStep(2);
      } else if (step === 2) {
        if (!recoveryCode) {
          toast.error("Por favor, insira o código de recuperação.");
          return;
        }
        const response = await axios.post("/api/password-recovery/verify-code", { email: recoveryEmail, code: recoveryCode, }, { withCredentials: true });
        if (response.status === 200) setStep(3);
      } else if (step === 3) {
        if (!newPassword || newPassword.length < 8) {
          toast.error("A nova senha deve ter pelo menos 8 caracteres.");
          return;
        }
        if (newPassword !== confirmNewPassword) {
          toast.error("As senhas não coincidem.");
          return;
        }
        await axios.post("/api/password-recovery/reset-password", { email: recoveryEmail, newPassword }, { withCredentials: true });
        setRecoveryOpen(false);
        toast.success("Senha alterada com sucesso!");
        setStep(1);
      }
    } catch (error) {
      if (step === 1) {
        setSendButtonDisabled(false);
      }
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Erro ao processar a solicitação.");
      } else {
        toast.error("Erro inesperado.");
      }
    }
  };

  const handleResendCode = async () => {
    if (!canResendCode) return;
    
    try {
      setCanResendCode(false);
      setResendCountdown(60);
      
      await axios.post("/api/password-recovery/request-code", { email: recoveryEmail });
      toast.success("Novo código enviado!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Erro ao reenviar o código.");
      } else {
        toast.error("Erro inesperado ao reenviar o código.");
      }
    }
  };

  return (
    <EmergeIn>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <button
          onClick={() => router.push("/")}
          className="absolute top-8 left-8 text-3xl text-gray-700 hover:text-gray-900"
        >
          &#60;
        </button>
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
              <a onClick={() => setRecoveryOpen(true)} className="text-sm text-blue-500 hover:underline cursor-pointer">
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
      <Dialog open={isRecoveryOpen} onClose={() => setRecoveryOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => {
                setRecoveryOpen(false);
                setStep(1);
                setRecoveryEmail("");
                setRecoveryCode("");
                setNewPassword("");
                setConfirmNewPassword("");
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold text-black mb-4">
              {step === 1 && "Recuperar Senha"}
              {step === 2 && "Verificar Código"}
              {step === 3 && "Alterar Senha"}
            </h2>
            {step === 1 && (
              <>
                <Label htmlFor="recoveryEmail" className="text-gray-700">Digite seu e-mail:</Label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
                <Button
                  onClick={handleRecoverySubmit}
                  disabled={sendButtonDisabled}
                  className={`mt-4 w-full text-white hover:scale-105 rounded-full transition-transform ${
                    sendButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1C3373] hover:bg-[#162b5e]'
                  }`}
                >
                  {sendButtonDisabled ? 'Enviando...' : 'Enviar Código'}
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <p className="text-gray-700">Código enviado para {recoveryEmail}. Digite o código abaixo:</p>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
                <Button
                  onClick={handleRecoverySubmit}
                  className="mt-4 w-full bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 rounded-full transition-transform"
                >
                  Verificar Código
                </Button>
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResendCode}
                    className={`text-sm ${
                      canResendCode 
                      ? 'text-blue-500 hover:underline cursor-pointer' 
                      : 'text-gray-400 cursor-default'
                    }`}
                  >
                    {canResendCode 
                      ? 'Não recebeu o código? Clique para reenviar' 
                      : `Aguarde ${resendCountdown}s para reenviar o código`}
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <Label htmlFor="newPassword" className="text-gray-700">Nova Senha:</Label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
                <Label htmlFor="confirmNewPassword" className="mt-4 text-gray-700">Confirme a Nova Senha:</Label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
                <Button
                  onClick={handleRecoverySubmit}
                  className="mt-4 w-full bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 rounded-full transition-transform"
                >
                  Alterar Senha
                </Button>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </EmergeIn>
  );
};

export default LoginForm;
