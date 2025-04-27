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

        const avatarpadrao = "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"
        //essa bomba aqui é a iamgem padrao
        const defaultAvatarBuffer = Buffer.from(avatarpadrao, "base64");
        const user =await createUser({ id: 0, name, email, password, phoneNumber });
        await salvarFotoService(defaultAvatarBuffer,user.result.id,); // Salva a foto do usuário
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
