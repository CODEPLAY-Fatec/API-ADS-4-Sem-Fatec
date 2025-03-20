import { User } from "@shared/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/database";
const SECRET_KEY = process.env.SECRET_KEY as string;

export const createUser = async ({ name, email, password, phoneNumber }: User) => {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser]: any = await db.query(checkEmailQuery, [email]);

    if (existingUser.length > 0) throw new Error("Este email já está em uso.");

    if (password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
    INSERT INTO users (name, email, password, phoneNumber) 
    VALUES (?, ?, ?, ?)
  `;
    console.log(name, email, hashedPassword, phoneNumber);
    const [result]: any = await db.query(insertQuery, [name, email, hashedPassword, phoneNumber]);

    return { id: result.insertId, name, email, phoneNumber, password: "" };
};

export const getUserInfo = async (token: any) => {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    return decoded;
};

// Adicionando a função para buscar todos os usuários
export const getAllUsers = async () => {
    const query = "SELECT id, name FROM users";
    const [users]: any = await db.query(query);
    return users;
};
