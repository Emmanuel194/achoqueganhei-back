import { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  updateUserPassword,
} from "../models/userModel";
import {
  generateToken,
  hashPassword,
  comparePassword,
} from "../utils/authUtils";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Redefinir sua senha",
    text: `Clique no link para redefinir sua senha: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({
      email,
      password: hashedPassword,
      name,
      id: 0,
    });
    return res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = generateToken(user.id);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const token = generateToken(user.id);
    await sendResetPasswordEmail(email, token);
    return res.json({
      message: "Um link para redefinir sua senha foi enviado para seu e-mail.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await findUserByEmail(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(user.email, hashedPassword);
    return res.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};
