import { Request, Response } from "express";
import { login } from "../services/authService";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token } = await login(email, password);

    res.cookie("token", token, {
      httpOnly: true, // Impede acesso via JavaScript no navegador
      secure: process.env.NODE_ENV === "production", // Garante HTTPS em produção
      sameSite: "strict", // Protege contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.json({ message: "Login realizado com sucesso" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};