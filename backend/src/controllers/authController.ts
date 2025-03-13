//controle de dados de entrada e de volta da autenticaçao
import { Request, Response } from 'express';
import { login } from '../services/authService';


export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const token = await login(email, password);
  
      res.json({ token }); // retornando token
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
  