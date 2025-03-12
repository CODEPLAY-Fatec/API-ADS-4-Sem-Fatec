import bcrypt from "bcrypt";
import {db} from "../config/database";
import {User} from "@shared/User";

export const createUser = async ({ name, email, password, phoneNumber}: User) => {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser]: any = await db.query(checkEmailQuery, [email]);

    if (existingUser.length > 0) throw new Error("Este email já está em uso.");

    if (password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
    
    const saltRounds = 10;
    const hashedPassword =  await bcrypt.hash(password, saltRounds);

    const insertQuery = `
    INSERT INTO users (name, email, password, phoneNumber) 
    VALUES (?, ?, ?, ?)
  `;
    console.log(name,email, hashedPassword,phoneNumber)
    const [result]: any = await db.query(insertQuery, [name, email, hashedPassword, phoneNumber]);

    return { id: result.insertId, name, email, phoneNumber,password: "" };
};