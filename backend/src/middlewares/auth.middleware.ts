
import type { Request, Response, NextFunction } from "express";

import db from "~/database"

import Token from "~/database/token.entity";

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("Token yok");

        const tokenString = authHeader.split(" ")[1];

        const tokenRepository = db.getRepository(Token);

        const token = await tokenRepository.findOne({
            where: { token: tokenString },
            relations: ["user", "user.role"],
        });

        if (!token) throw new Error("Token geçersiz");

        res.locals.user = token.user;

        next();
    } catch (error) {
        return res.status(401).json({ code: 401, message: "Yetkisiz Giriş" });
    }
}