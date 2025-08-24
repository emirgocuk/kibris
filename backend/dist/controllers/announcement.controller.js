"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.putAnnouncement = exports.postAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = void 0;
const database_1 = __importDefault(require("../database"));
const announcement_entity_1 = __importDefault(require("../database/announcement.entity"));
const getAnnouncements = async (req, res) => {
    try {
        const { forAdmins } = req.query; // ?forAdmins=true | false | undefined
        const announcementRepo = database_1.default.getRepository(announcement_entity_1.default);
        // Eğer parametre verilmemişse varsayılan olarak false
        const where = { forAdmins: forAdmins === "true" };
        const announcements = await announcementRepo.find({
            where,
            order: { id: "DESC" }
        });
        res.status(200).json(announcements);
    }
    catch (error) {
        console.error("getAnnouncements error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.getAnnouncements = getAnnouncements;
// 📌 Tek duyuru getir
const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcementRepo = database_1.default.getRepository(announcement_entity_1.default);
        const announcement = await announcementRepo.findOneBy({ id: Number(id) });
        if (!announcement)
            return res.status(404).json({ error: "Duyuru bulunamadı" });
        res.status(200).json(announcement);
    }
    catch (error) {
        console.error("getAnnouncementById error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.getAnnouncementById = getAnnouncementById;
// 📌 Yeni duyuru ekle
const postAnnouncement = async (req, res) => {
    try {
        const { title, content, forAdmins = false } = req.body;
        const user = res.locals.user;
        if (!title || !content) {
            return res.status(400).json({ error: "Başlık ve içerik boş olamaz" });
        }
        const announcementRepo = database_1.default.getRepository(announcement_entity_1.default);
        // Aynı başlıktan var mı kontrolü
        const exists = await announcementRepo.findOneBy({ title });
        if (exists) {
            return res.status(409).json({ error: "Bu başlıkla zaten bir duyuru var" });
        }
        const announcement = announcementRepo.create({
            title,
            content,
            forAdmins: Boolean(forAdmins),
            user
        });
        await announcementRepo.save(announcement);
        res.status(201).json(announcement);
    }
    catch (error) {
        console.error("postAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.postAnnouncement = postAnnouncement;
// 📌 Duyuru güncelle
const putAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, forAdmins } = req.body;
        const announcementRepo = database_1.default.getRepository(announcement_entity_1.default);
        const announcement = await announcementRepo.findOneBy({ id: Number(id) });
        if (!announcement)
            return res.status(404).json({ error: "Duyuru bulunamadı" });
        // Başlık çakışmasını önle
        if (title && title !== announcement.title) {
            const exists = await announcementRepo.findOneBy({ title });
            if (exists) {
                return res.status(409).json({ error: "Bu başlıkla zaten bir duyuru var" });
            }
        }
        announcement.title = title ?? announcement.title;
        announcement.content = content ?? announcement.content;
        announcement.forAdmins = forAdmins ?? announcement.forAdmins;
        await announcementRepo.save(announcement);
        res.status(200).json(announcement);
    }
    catch (error) {
        console.error("putAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.putAnnouncement = putAnnouncement;
// 📌 Duyuru sil
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcementRepo = database_1.default.getRepository(announcement_entity_1.default);
        const announcement = await announcementRepo.findOneBy({ id: Number(id) });
        if (!announcement)
            return res.status(404).json({ error: "Duyuru bulunamadı" });
        await announcementRepo.remove(announcement);
        res.status(200).json({ message: "Duyuru başarıyla silindi" });
    }
    catch (error) {
        console.error("deleteAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
