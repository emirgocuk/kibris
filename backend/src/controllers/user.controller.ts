import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import db from "~/database";
import User from "~/database/user.entity";

// Yeni kullanıcı oluştur
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, password, role, email, biography } = req.body;

        if (!name || !password || !role) {
            return res.status(400).json({ error: "Eksik alan" });
        }

        const userRepo = db.getRepository(User);
        const existing = await userRepo.findOne({ where: { name } });
        if (existing) return res.status(409).json({ error: "Kullanıcı zaten var" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User();
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// Kullanıcıyı güncelle
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, password, role, email, biography } = req.body;

        const userRepo = db.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

        if (name) user.name = name;
        if (role) user.roleId = role;
        if (email) user.email = email;
        if (biography !== undefined) user.biography = biography;
        if (password) user.password = await bcrypt.hash(password, 10);

        // photo kontrolü
        if (req.file) {
            user.photo = req.file.buffer;
        }

        await userRepo.save(user);
        res.status(200).json({ message: "Kullanıcı güncellendi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// Tüm kullanıcıları listele
export const listUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        const userRepo = db.getRepository(User);

        let users;

        if (role && typeof role === "string") {
            users = await userRepo.find({
                where: { role: { name: role } },
                relations: ["role"],
                select: ["id", "name", "biography"],
            });
        } else {
            users = await userRepo.find({
                relations: ["role"],
                select: ["id", "name", "biography"],
            });
        }

        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// Tek kullanıcıyı getir
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userRepo = db.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: Number(id) },
            select: ["id", "name", "roleId", "email", "biography", "photo"],
        });
        if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// Kullanıcıyı sil
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userRepo = db.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

        await userRepo.remove(user);
        res.status(200).json({ message: "Kullanıcı silindi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
