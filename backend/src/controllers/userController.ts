import { Request, Response } from "express";
import { createUser } from "../services/userService";



export const createUserController = async (req: Request, res: Response) => {
    const { name, email, password,phoneNumber } = req.body;
    if(!name){
        res.status(400).send({message: "Nome do usuario é obrigatório."});
        return
    }
    if(!email){
        res.status(400).send({message : "Email é obrigatório."});
        return
    }
    
    if(!password){
        res.status(400).send({message : "Senha é obrigatório."});
        return
    }

    if(!phoneNumber){
        res.status(400).send({message : "Numero de telefone é obrigatório."});
        return
    }

    try {
        const newUser = await createUser({ name, email, password, phoneNumber,});

        res.status(201).json({message : "Conta criada com sucesso!"});
    } catch (error: any) {
        res.status(500).json({error});
        console.warn(error)
    }
};