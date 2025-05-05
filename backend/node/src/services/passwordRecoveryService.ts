import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EXPIRATION_TIME = 10 * 60 * 1000;
const recoveryCodes: { [id: number]: { code: string; expiresAt: number } } = {};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "quantum.gestaoproj@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordRecoveryEmail = async (
  email: string,
  recoveryCode: string
): Promise<boolean> => {
  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) return false;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Prezado(a) ${user.name},</p>
        <p>Aqui está o código para recuperar sua senha:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4A90E2; text-align: center; letter-spacing: 2px;">${recoveryCode}</p>
        <p>Esse código é válido por 10 minutos.</p>
        <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail.</p>
        <br>
        <p>Atenciosamente,</p>
        <p><strong>Quantum Enterprise</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Quantum Enterprise" <quantum.gestaoproj@gmail.com>',
      to: email,
      subject: "Recuperação de Senha",
      html: htmlContent,
    });

    recoveryCodes[user.id] = {
      code: recoveryCode,
      expiresAt: Date.now() + EXPIRATION_TIME,
    };

    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail de recuperação:", error);
    return false;
  }
};

export const verifyRecoveryCode = async (email: string, code: string): Promise<boolean> => {
  const user = await prisma.users.findFirst({ where: { email } });
  if (!user) return false;

  const recoveryData = recoveryCodes[user.id];
  if (
    !recoveryData ||
    recoveryData.code !== code ||
    Date.now() > recoveryData.expiresAt
  ) {
    return false;
  }

  delete recoveryCodes[user.id];
  return true;
};

export const updatePassword = async (
  email: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.users.findFirst({ where: { email } });
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.users.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};
