//services para autenticaçao
import {db} from "../config/database";
import {User} from "@shared/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

require('dotenv').config();
const secretKey = process.env.SECRET;
if (!secretKey) {
  throw new Error('SECRET não definido.');
}

export const login = async (email: string, password: string): Promise<{ token: string}> => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results]: any = await db.query(query, [email]);
  
    if (results.length === 0) {
      throw new Error('Usuário não encontrado.');
    }
  
    const user = results[0] as User;
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
    if (isPasswordCorrect) {
    
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone : user.phoneNumber
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
      return { token }; 

    } else {
      throw new Error('Senha incorreta.');
    }
  };