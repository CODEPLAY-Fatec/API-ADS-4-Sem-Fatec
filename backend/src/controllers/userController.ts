import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import { AttPasswordService, buscarFotobyId, createUser, getAllUsers, getUserInfo, salvarFotoService, updateUserService } from "../services/userService";

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
    if (!password || password.length < 8) {
        res.status(400).send({ message: "A senha deve ter pelo menos 8 caracteres." });
        return;
    }
    if (!phoneNumber) {
        res.status(400).send({ message: "Numero de telefone é obrigatório." });
        return;
    }

    try {
        await createUser({ id: 0, name, email, password, phoneNumber });
        res.status(201).send({ message: "Conta criada com sucesso!" });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
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

// Adicionando o controlador para buscar todos os usuários
export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários." });
    }
};

export const AttPasswordController = async (req: Request, res: Response) => {
    const { password, newpassword } = req.body;
    const token = req.cookies?.token;

    if (!token || !password) {
        res.status(401).json({ message: "Preencha todos os campos para alterar senha." });
        console.log("Usuário não autenticado.");
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        await AttPasswordService(decoded.id, password, newpassword);
        res.status(201).send({ message: "Senha alterada com sucesso!" });
    } catch (error: any) {
        // Retorne uma mensagem clara no erro
        const errorMessage = error.message || "Erro ao alterar a senha.";
        res.status(400).json({ message: errorMessage });
        console.warn(error);
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    const { user: User } = req.body;
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: "Não foi encontrado o cookie" }); //retorno de erro pro frontend caso eles esqueçam de enviar
        console.log("Cookie faltando");
        return;
    }
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    try {
        await updateUserService(User, decoded.id);
        res.status(201).send({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao atualizar usuário." });
        console.warn(error);
    }
};

export const uploadFotoController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send("Nenhum arquivo enviado");
            return;
        }

        const userInfo = await getUserInfo(req.cookies.token);
        if (!userInfo) {
            res.status(401).send("Usuário não autenticado");
            return;
        }
        const imagemProcessada = await sharp(req.file.buffer).resize(300, 300).jpeg({ quality: 80 }).toBuffer();

        await salvarFotoService(imagemProcessada, userInfo.id);
        res.status(200).send("Imagem salva com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao salvar imagem");
    }
};

export const getFotoController = async (req: Request, res: Response) => {
    try {
        const user = await getUserInfo(req.cookies.token);
        if (!user) {
            res.status(401).send("Usuário não autenticado");
            return;
        }

        const imagem = await buscarFotobyId(user.id);
        if (!imagem) {
            res.status(404).send("Foto não encontrada");
            return;
        }

        const base64Image = Buffer.from(imagem.file).toString("base64");
        res.json({ base64: base64Image });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar imagem");
    }
};
