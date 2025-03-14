import { Request, Response } from "express";
import { createUser } from "../services/userService";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
  console.error("SECRET_KEY não foi definida!");
}

//criar usuario
export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name) {
    res.status(400).send({ message: "Nome do usuario é obrigatório." });
    return;
  }
  if (!email) {
    res.status(400).send({ message: "Email é obrigatório." });
    return;
  }
  if (!password) {
    res.status(400).send({ message: "Senha é obrigatório." });
    return;
  }
  if (!phoneNumber) {
    res.status(400).send({ message: "Numero de telefone é obrigatório." });
    return;
  }

  try {
    const newUser = await createUser({ name, email, password, phoneNumber });
    res.status(201).json({ message: "Conta criada com sucesso!" });
  } catch (error: any) {
    res.status(500).json({ error });
    console.warn(error);
  }
};

//pegar informaçoess do usuario logado
export const meController = (req: Request, res: Response): void => {
  //funcao para pegar dados do usuario logado
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: "Usuário não autenticado." });
      console.log("Usuário não autenticado.");
      return;
    }
    if (!SECRET_KEY) {
      res.status(500).json({ message: "SECRET_KEY não foi definida!" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    res.json({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
    });
    console.log("Usuário autenticado.");
    return;
  } catch (error) {
    res.status(403).json({ message: "Token inválido!" });
    console.log("Token inválido!");
    return;
  }
};

export const logoutController = (req: Request, res: Response) => {
  //funçao para sair e limpar o cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logout realizado com sucesso" });
};

