//services para autenticaçao
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('SECRET não definido.');
}

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  // Usando Prisma para buscar o usuário pelo email
  const user = await prisma.user.findFirst({
    where: {email : email}
  })

  if (!user) {
    console.log('Usuário não encontrado.');
    throw new Error('Usuário não encontrado.');
  }

  // Comparando a senha
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber,
    };

    // Gerando o token JWT
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    return { token };
  } else {
    throw new Error('Usuário ou senha incorretos.');
  }
};
