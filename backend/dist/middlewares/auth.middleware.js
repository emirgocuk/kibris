"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const database_1 = __importDefault(require("../database"));
const token_entity_1 = __importDefault(require("../database/token.entity"));
async function default_1(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new Error("Token yok");
        const tokenString = authHeader.split(" ")[1];
        const tokenRepository = database_1.default.getRepository(token_entity_1.default);
        const token = await tokenRepository.findOne({
            where: { token: tokenString },
            relations: ["user", "user.role"],
        });
        if (!token)
            throw new Error("Token geçersiz");
        res.locals.user = token.user;
        next();
    }
    catch (error) {
        return res.status(401).json({ code: 401, message: "Yetkisiz Giriş" });
    }
}
