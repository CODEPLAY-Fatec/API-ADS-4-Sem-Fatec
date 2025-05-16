import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import {
  sendPasswordRecoveryEmail,
  verifyRecoveryCode,
  updatePassword,
} from "../services/passwordRecoveryService";

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('SECRET não definido.');
}

export const requestRecoveryCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const emailSent = await sendPasswordRecoveryEmail(email, recoveryCode);
    if (!emailSent) {
      res.status(404).send({ message: "Usuário não encontrado." });
      return;
    }
    res
      .status(200)
      .send({ message: "Código de recuperação enviado para o e-mail." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Erro ao enviar o código de recuperação." });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      res.status(400).send({ message: "E-mail e código são obrigatórios." });
      return;
    }

    const isValid = await verifyRecoveryCode(email, code);
    if (isValid) {
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "10m" });
      res.cookie("recoveryToken", token, { //token para confirmar para troca de senha
        httpOnly: true,
        secure:true,
        sameSite: "strict", // Protege contra CSRF
        maxAge: 10 * 60 * 1000, // 10 minutos
      });
      res.status(200).send({ message: "Código verificado com sucesso." });
      return;
    }

    res.status(400).send({ message: "Código inválido ou expirado." });
  } catch (error) {
    res.status(500).send({ message: "Erro ao verificar o código." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      res
        .status(400)
        .send({ message: "E-mail e nova senha são obrigatórios." });
      return;
    }

    if (newPassword.length < 8) {
      res
        .status(400)
        .send({ message: "A nova senha deve ter pelo menos 8 caracteres." });
      return;
    }
    const token = req.cookies.recoveryToken;
    if (!token) {
      res.status(401).send({ message: "Você não tem permissão para trocar de senha para esse usuario." });
      return;
    }
    jwt.verify(token, SECRET_KEY, (err: any) => {//verificando se o caba tem um token
      if (err) {
        res.status(401).send({ message: "Token inválido ou expirado." });
        return;
      }
    });
    const decodedToken = jwt.decode(token) as { email: string };
    const email = decodedToken.email;

    await updatePassword(email, newPassword);
    res.status(200).send({ message: "Senha atualizada com sucesso." });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado.") {
      res.status(404).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Erro ao atualizar a senha." });
    }
  }
};
