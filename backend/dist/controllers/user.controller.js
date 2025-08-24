"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.listUsers = exports.updateUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const user_entity_1 = __importDefault(require("../database/user.entity"));
// Yeni kullanıcı oluştur
const createUser = async (req, res) => {
    try {
        const { name, password, role, email, biography } = req.body;
        if (!name || !password || !role) {
            return res.status(400).json({ error: "Eksik alan" });
        }
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        const existing = await userRepo.findOne({ where: { name } });
        if (existing)
            return res.status(409).json({ error: "Kullanıcı zaten var" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new user_entity_1.default();
        user.name = name;
        user.password = hashedPassword;
        user.roleId = role;
        user.email = email;
        user.biography = biography || "";
        // photo kontrolü
        if (req.file) {
            user.photo = req.file.buffer;
        }
        await userRepo.save(user);
        return res.status(201).json({ message: "Kullanıcı oluşturuldu", userId: user.id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.createUser = createUser;
// Kullanıcıyı güncelle
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, role, email, biography } = req.body;
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        const user = await userRepo.findOne({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        if (name)
            user.name = name;
        if (role)
            user.roleId = role;
        if (email)
            user.email = email;
        if (biography !== undefined)
            user.biography = biography;
        if (password)
            user.password = await bcrypt_1.default.hash(password, 10);
        // photo kontrolü
        if (req.file) {
            user.photo = req.file.buffer;
        }
        await userRepo.save(user);
        res.status(200).json({ message: "Kullanıcı güncellendi" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.updateUser = updateUser;
// Tüm kullanıcıları listele
const listUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        let users;
        if (role && typeof role === "string") {
            users = await userRepo.find({
                where: { role: { name: role } },
                relations: ["role"],
                select: ["id", "name", "biography"],
            });
        }
        else {
            users = await userRepo.find({
                relations: ["role"],
                select: ["id", "name", "biography"],
            });
        }
        res.status(200).json({ users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.listUsers = listUsers;
// Tek kullanıcıyı getir
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        const user = await userRepo.findOne({
            where: { id: Number(id) },
            select: ["id", "name", "roleId", "email", "biography", "photo"],
        });
        if (!user)
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.getUser = getUser;
// Kullanıcıyı sil
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        const user = await userRepo.findOne({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        await userRepo.remove(user);
        res.status(200).json({ message: "Kullanıcı silindi" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.deleteUser = deleteUser;
