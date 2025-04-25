import { Request, Response } from "express";
import {
  sendPasswordRecoveryEmail,
  verifyRecoveryCode,
  updatePassword,
} from "../services/passwordRecoveryService";

export const requestRecoveryCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const emailSent = await sendPasswordRecoveryEmail(email, recoveryCode);
    if (!emailSent) {
      res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json({ message: "Código de recuperação enviado para o e-mail." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar o código de recuperação." });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      res.status(400).json({ message: "E-mail e código são obrigatórios." });
    }

    const isValid = await verifyRecoveryCode(email, code);
    if (isValid) {
      res.status(200).json({ message: "Código verificado com sucesso." });
    }

    res.status(400).json({ message: "Código inválido ou expirado." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar o código." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      res.status(400).json({ message: "E-mail e nova senha são obrigatórios." });
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: "A nova senha deve ter pelo menos 8 caracteres." });
    }

    await updatePassword(email, newPassword);
    res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado.") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao atualizar a senha." });
    }
  }
};
