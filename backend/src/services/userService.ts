import { User } from "@shared/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient}from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;
const saltRounds = 10;

export const createUser = async ({ name, email, password, phoneNumber }: User) => {
    const existingUser = await prisma.users.findFirst({
        where: {
            email:email
        }
    })

    if (existingUser) throw new Error("Este email já está em uso.");

    if (password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");

   
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await prisma.users.create({
        data :{
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        }
    })

    return {result};
};

export const getUserInfo = async (token: any) => {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    return decoded;
};

// Adicionando a função para buscar todos os usuários
export const getAllUsers = async () => {
    const users = await prisma.users.findMany();
    return users;
};
