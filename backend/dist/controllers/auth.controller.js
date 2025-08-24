"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../database"));
const user_entity_1 = __importDefault(require("../database/user.entity"));
const token_entity_1 = __importDefault(require("../database/token.entity"));
const auth = async (req, res) => {
    try {
        const user = res.locals.user;
        // Kullanıcı yoksa veya rolü "user" değilse engelle
        if (!user || !user.role || user.role.name == "user") {
            return res.status(403).json({ code: 403, message: "Yetkiniz yok" });
        }
        // Buraya kullanıcı "user" rolündeyse yapılacak işlemleri ekleyebilirsin
        return res.status(200).json({ code: 200, message: "Yetkili kullanıcı", user });
    }
    catch (error) {
        return res.status(500).json({ code: 500, message: "Sunucu hatası" });
    }
};
exports.auth = auth;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepository = database_1.default.getRepository(user_entity_1.default);
        const tokenRepository = database_1.default.getRepository(token_entity_1.default);
        const user = await userRepository.findOne({ where: { email }, select: ["id", "password"] });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Şifre hatalı" });
        }
        const tokenString = crypto_1.default.randomBytes(32).toString("hex");
        const token = tokenRepository.create({
            token: tokenString,
            user: user
        });
        await tokenRepository.save(token);
        res.status(200).json({ "token": tokenString });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userRepository = database_1.default.getRepository(user_entity_1.default);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        await userRepository.save(user);
        res.status(200).json({ message: "User registered!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.register = register;
