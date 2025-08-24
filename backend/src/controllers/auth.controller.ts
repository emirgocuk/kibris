import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto"

import db from "~/database"
import User from "~/database/user.entity"
import Token from "~/database/token.entity"

export const auth = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        // Kullanıcı yoksa veya rolü "user" değilse engelle
        if (!user || !user.role || user.role.name == "user") {
            return res.status(403).json({ code: 403, message: "Yetkiniz yok" });
        }

        // Buraya kullanıcı "user" rolündeyse yapılacak işlemleri ekleyebilirsin
        return res.status(200).json({ code: 200, message: "Yetkili kullanıcı", user });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Sunucu hatası" });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userRepository = db.getRepository(User);
        const tokenRepository = db.getRepository(Token);

        const user = await userRepository.findOne({ where: { email }, select: ["id", "password"] });

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Şifre hatalı" });
        }

        const tokenString = crypto.randomBytes(32).toString("hex");

        const token = tokenRepository.create({
            token: tokenString,
            user: user
        });

        await tokenRepository.save(token);

        res.status(200).json({ "token": tokenString });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userRepository = db.getRepository(User);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        res.status(200).json({ message: "User registered!" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" });
    }
};
