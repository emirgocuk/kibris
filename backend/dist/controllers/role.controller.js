"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.putRole = exports.postRole = exports.getRoles = void 0;
const database_1 = __importDefault(require("../database"));
const role_entity_1 = __importDefault(require("../database/role.entity"));
// Tüm rolleri getir
const getRoles = async (_req, res) => {
    try {
        const roleRepo = database_1.default.getRepository(role_entity_1.default);
        const roles = await roleRepo.find();
        res.status(200).json({ roles });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getRoles = getRoles;
// Yeni rol ekle
const postRole = async (req, res) => {
    try {
        const { name, canManagePages, canCreateNews, canEditNews, canDeleteNews, canCreateBook, canEditBook, canDeleteBook, canApprovePost, canManageAnnouncements, canManageUsers, canManageRoles, canManageGallery, canManageSlider } = req.body;
        const roleRepo = database_1.default.getRepository(role_entity_1.default);
        const existing = await roleRepo.findOneBy({ name });
        if (existing)
            return res.status(400).json({ message: "Rol zaten mevcut" });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.postRole = postRole;
// Var olan rolü güncelle
const putRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, canManagePages, canCreateNews, canEditNews, canDeleteNews, canCreateBook, canEditBook, canDeleteBook, canApprovePost, canManageAnnouncements, canManageUsers, canManageRoles, canManageGallery, canManageSlider } = req.body;
        const roleRepo = database_1.default.getRepository(role_entity_1.default);
        const role = await roleRepo.findOneBy({ id: Number(id) });
        if (!role)
            return res.status(404).json({ message: "Rol bulunamadı" });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putRole = putRole;
// Rol sil
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const roleRepo = database_1.default.getRepository(role_entity_1.default);
        const role = await roleRepo.findOneBy({ id: Number(id) });
        if (!role)
            return res.status(404).json({ message: "Rol bulunamadı" });
        if (["superadmin", "admin"].includes(role.name)) {
            return res.status(403).json({ message: "Bu rol silinemez" });
        }
        await roleRepo.remove(role);
        res.status(200).json({ message: "Rol silindi" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteRole = deleteRole;
