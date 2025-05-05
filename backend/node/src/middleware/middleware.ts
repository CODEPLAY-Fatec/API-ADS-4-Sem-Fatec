import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";


const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error("SECRET_KEY não foi definida!");
  process.exit(1);
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Acesso negado! Token não fornecido." });
    return;
  }

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido!" });
    console.log("Token inválido!");
  }
};

