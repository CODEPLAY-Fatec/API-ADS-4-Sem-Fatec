import { User } from "@shared/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;
const saltRounds = 10;

export const createUser = async ({ name, email, password, phoneNumber }: User) => {
    const existingUser = await prisma.users.findFirst({
        where: {
            email: email
        }
    })

    if (existingUser) throw new Error("Este email já está em uso.");

    if (password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        }
    })

    return { result };
};

export const getUserInfo = async (token: any) => {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    return decoded;
};

// Adicionando a função para buscar todos os usuários
export const getAllUsers = async () => {
    const users = await prisma.users.findMany(
        {
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
            }
        }
    );
    return users;
};

export const getUserById = async (id: number) => {
    const user = await prisma.users.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
        }
    })
    return user;
}

export const getUserByEmail = async (email: string) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const user = await prisma.users.findFirst({
        where: {
            email: email
        },
        select:{
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
        }
    })
    return user;
}

export const AttPasswordService = async (id: number, password: string,newpassword:string) => {
    const newHashedPassword = await bcrypt.hash(newpassword, saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const changedPassword = await prisma.users.update({
        where:{
            id: id,
            password : hashedPassword
        },
        data:{
            password : newHashedPassword,
        }
    })

    return changedPassword;
}

export const updateUserService = async (user:User,userId : number) => {
    const updatedUser = await prisma.users.update({
        where: {
            id: userId,
        },
        data: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
        }
    })
    return updatedUser


}
