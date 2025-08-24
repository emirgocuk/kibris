import type { Request, Response } from "express";
import db from "~/database";
import New from "~/database/new.entity";
import Book from "~/database/book.entity";
import Photo from "~/database/photo.entity";
import User from "~/database/user.entity";

export const showNewsCover = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const newsRepo = db.getRepository(New);
        const news = await newsRepo.findOne({ where: { id: Number(id) }, select: ["cover"] });

        if (!news || !news.cover) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }

        res.setHeader("Content-Type", "image/jpeg");
        return res.send(news.cover);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const showBookCover = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const bookRepo = db.getRepository(Book);
        const book = await bookRepo.findOne({ where: { id: Number(id) }, select: ["cover"] });

        if (!book || !book.cover) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }

        res.setHeader("Content-Type", "image/jpeg");
        return res.send(book.cover);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const showUserPhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userRepo = db.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(id) }, select: ["photo"] });

        if (!user || !user.photo) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }

        res.setHeader("Content-Type", "image/jpeg");
        return res.send(user.photo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const postPhotoArray = async (req: Request, res: Response) => {
    try {
        const photoRepo = db.getRepository(Photo);

        if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
            return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
        }

        const photos = (req.files as Express.Multer.File[]).map((file) => {
            const photo = new Photo();
            photo.data = file.buffer;
            photo.mimeType = file.mimetype;
            photo.isShared = true
            return photo;
        });

        await photoRepo.save(photos);

        return res.status(201).json({ message: "Fotoğraflar başarıyla yüklendi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const showPhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const photoRepo = db.getRepository(Photo);

        const photo = await photoRepo.findOne({ where: { id: Number(id) } });

        if (!photo) {
            return res.status(404).json({ error: "Fotoğraf bulunamadı" });
        }

        res.setHeader("Content-Type", photo.mimeType);
        return res.send(photo.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const listPhotoIds = async (_req: Request, res: Response) => {
    try {
        const photoRepo = db.getRepository(Photo);

        // Tüm fotoğrafların sadece id'sini çek
        const photos = await photoRepo.find({ select: ["id", "isShared"] });

        return res.status(200).json(photos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const photoRepo = db.getRepository(Photo);

        const photo = await photoRepo.findOne({ where: { id: Number(id) } });

        if (!photo) {
            return res.status(404).json({ error: "Fotoğraf bulunamadı" });
        }

        await photoRepo.remove(photo);

        return res.status(200).json({ message: "Fotoğraf başarıyla silindi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const postSinglePhoto = async (req: Request, res: Response) => {
    try {
        const photoRepo = db.getRepository(Photo);

        if (!req.file) {
            return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
        }

        const photo = new Photo();
        photo.data = req.file.buffer;
        photo.mimeType = req.file.mimetype;
        photo.isShared = false;

        await photoRepo.save(photo);

        return res.status(201).json({ message: "Fotoğraf başarıyla yüklendi", id: photo.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};