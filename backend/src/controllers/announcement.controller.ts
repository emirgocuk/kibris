import type { Request, Response } from "express";
import db from "~/database";
import Announcement from "~/database/announcement.entity";

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const { forAdmins } = req.query; // ?forAdmins=true | false | undefined
        const announcementRepo = db.getRepository(Announcement);

        // Eğer parametre verilmemişse varsayılan olarak false
        const where = { forAdmins: forAdmins === "true" };

        const announcements = await announcementRepo.find({
            where,
            order: { id: "DESC" }
        });

        res.status(200).json(announcements);
    } catch (error) {
        console.error("getAnnouncements error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};



// 📌 Tek duyuru getir
export const getAnnouncementById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const announcementRepo = db.getRepository(Announcement);

        const announcement = await announcementRepo.findOneBy({ id: Number(id) });
        if (!announcement) return res.status(404).json({ error: "Duyuru bulunamadı" });

        res.status(200).json(announcement);
    } catch (error) {
        console.error("getAnnouncementById error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// 📌 Yeni duyuru ekle
export const postAnnouncement = async (req: Request, res: Response) => {
    try {
        const { title, content, forAdmins = false } = req.body;
        const user = res.locals.user;
        if (!title || !content) {
            return res.status(400).json({ error: "Başlık ve içerik boş olamaz" });
        }

        const announcementRepo = db.getRepository(Announcement);

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
    } catch (error) {
        console.error("postAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// 📌 Duyuru güncelle
export const putAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, forAdmins } = req.body;

        const announcementRepo = db.getRepository(Announcement);
        const announcement = await announcementRepo.findOneBy({ id: Number(id) });

        if (!announcement) return res.status(404).json({ error: "Duyuru bulunamadı" });

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
    } catch (error) {
        console.error("putAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// 📌 Duyuru sil
export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const announcementRepo = db.getRepository(Announcement);

        const announcement = await announcementRepo.findOneBy({ id: Number(id) });
        if (!announcement) return res.status(404).json({ error: "Duyuru bulunamadı" });

        await announcementRepo.remove(announcement);

        res.status(200).json({ message: "Duyuru başarıyla silindi" });
    } catch (error) {
        console.error("deleteAnnouncement error:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
