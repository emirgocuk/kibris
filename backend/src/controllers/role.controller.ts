import type { Request, Response } from "express";
import db from "~/database";
import Role from "~/database/role.entity";

// Tüm rolleri getir
export const getRoles = async (_req: Request, res: Response) => {
    try {
        const roleRepo = db.getRepository(Role);
        const roles = await roleRepo.find();
        res.status(200).json({ roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Yeni rol ekle
export const postRole = async (req: Request, res: Response) => {
    try {
        const {
            name,
            canManagePages,
            canCreateNews,
            canEditNews,
            canDeleteNews,
            canCreateBook,
            canEditBook,
            canDeleteBook,
            canApprovePost,
            canManageAnnouncements,
            canManageUsers,
            canManageRoles,
            canManageGallery,
            canManageSlider
        } = req.body;

        const roleRepo = db.getRepository(Role);
        const existing = await roleRepo.findOneBy({ name });
        if (existing) return res.status(400).json({ message: "Rol zaten mevcut" });

        const role = roleRepo.create({
            name,
            canManagePages: !!canManagePages,
            canCreateNews: !!canCreateNews,
            canEditNews: !!canEditNews,
            canDeleteNews: !!canDeleteNews,
            canCreateBook: !!canCreateBook,
            canEditBook: !!canEditBook,
            canDeleteBook: !!canDeleteBook,
            canApprovePost: !!canApprovePost,
            canManageAnnouncements: !!canManageAnnouncements,
            canManageUsers: !!canManageUsers,
            canManageRoles: !!canManageRoles,
            canManageGallery: !!canManageGallery,
            canManageSlider: !!canManageSlider,
        });

        await roleRepo.save(role);
        res.status(201).json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Var olan rolü güncelle
export const putRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            canManagePages,
            canCreateNews,
            canEditNews,
            canDeleteNews,
            canCreateBook,
            canEditBook,
            canDeleteBook,
            canApprovePost,
            canManageAnnouncements,
            canManageUsers,
            canManageRoles,
            canManageGallery,
            canManageSlider
        } = req.body;

        const roleRepo = db.getRepository(Role);
        const role = await roleRepo.findOneBy({ id: Number(id) });
        if (!role) return res.status(404).json({ message: "Rol bulunamadı" });

        role.name = name ?? role.name;
        role.canManagePages = canManagePages ?? role.canManagePages;
        role.canCreateNews = canCreateNews ?? role.canCreateNews;
        role.canEditNews = canEditNews ?? role.canEditNews;
        role.canDeleteNews = canDeleteNews ?? role.canDeleteNews;
        role.canCreateBook = canCreateBook ?? role.canCreateBook;
        role.canEditBook = canEditBook ?? role.canEditBook;
        role.canDeleteBook = canDeleteBook ?? role.canDeleteBook;
        role.canApprovePost = canApprovePost ?? role.canApprovePost;
        role.canManageAnnouncements = canManageAnnouncements ?? role.canManageAnnouncements;
        role.canManageUsers = canManageUsers ?? role.canManageUsers;
        role.canManageRoles = canManageRoles ?? role.canManageRoles;
        role.canManageGallery = canManageGallery ?? role.canManageGallery;
        role.canManageSlider = canManageSlider ?? role.canManageSlider;

        await roleRepo.save(role);
        res.status(200).json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Rol sil
export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const roleRepo = db.getRepository(Role);

        const role = await roleRepo.findOneBy({ id: Number(id) });
        if (!role) return res.status(404).json({ message: "Rol bulunamadı" });

        if (["superadmin", "admin"].includes(role.name)) {
            return res.status(403).json({ message: "Bu rol silinemez" });
        }

        await roleRepo.remove(role);
        res.status(200).json({ message: "Rol silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
