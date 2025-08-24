"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSinglePhoto = exports.deletePhoto = exports.listPhotoIds = exports.showPhoto = exports.postPhotoArray = exports.showUserPhoto = exports.showBookCover = exports.showNewsCover = void 0;
const database_1 = __importDefault(require("../database"));
const new_entity_1 = __importDefault(require("../database/new.entity"));
const book_entity_1 = __importDefault(require("../database/book.entity"));
const photo_entity_1 = __importDefault(require("../database/photo.entity"));
const user_entity_1 = __importDefault(require("../database/user.entity"));
const showNewsCover = async (req, res) => {
    try {
        const { id } = req.params;
        const newsRepo = database_1.default.getRepository(new_entity_1.default);
        const news = await newsRepo.findOne({ where: { id: Number(id) }, select: ["cover"] });
        if (!news || !news.cover) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }
        res.setHeader("Content-Type", "image/jpeg");
        return res.send(news.cover);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.showNewsCover = showNewsCover;
const showBookCover = async (req, res) => {
    try {
        const { id } = req.params;
        const bookRepo = database_1.default.getRepository(book_entity_1.default);
        const book = await bookRepo.findOne({ where: { id: Number(id) }, select: ["cover"] });
        if (!book || !book.cover) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }
        res.setHeader("Content-Type", "image/jpeg");
        return res.send(book.cover);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.showBookCover = showBookCover;
const showUserPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepo = database_1.default.getRepository(user_entity_1.default);
        const user = await userRepo.findOne({ where: { id: Number(id) }, select: ["photo"] });
        if (!user || !user.photo) {
            return res.status(404).json({ error: "Kapak görseli bulunamadı" });
        }
        res.setHeader("Content-Type", "image/jpeg");
        return res.send(user.photo);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.showUserPhoto = showUserPhoto;
const postPhotoArray = async (req, res) => {
    try {
        const photoRepo = database_1.default.getRepository(photo_entity_1.default);
        if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
            return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
        }
        const photos = req.files.map((file) => {
            const photo = new photo_entity_1.default();
            photo.data = file.buffer;
            photo.mimeType = file.mimetype;
            photo.isShared = true;
            return photo;
        });
        await photoRepo.save(photos);
        return res.status(201).json({ message: "Fotoğraflar başarıyla yüklendi" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.postPhotoArray = postPhotoArray;
const showPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const photoRepo = database_1.default.getRepository(photo_entity_1.default);
        const photo = await photoRepo.findOne({ where: { id: Number(id) } });
        if (!photo) {
            return res.status(404).json({ error: "Fotoğraf bulunamadı" });
        }
        res.setHeader("Content-Type", photo.mimeType);
        return res.send(photo.data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.showPhoto = showPhoto;
const listPhotoIds = async (_req, res) => {
    try {
        const photoRepo = database_1.default.getRepository(photo_entity_1.default);
        // Tüm fotoğrafların sadece id'sini çek
        const photos = await photoRepo.find({ select: ["id", "isShared"] });
        return res.status(200).json(photos);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.listPhotoIds = listPhotoIds;
const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const photoRepo = database_1.default.getRepository(photo_entity_1.default);
        const photo = await photoRepo.findOne({ where: { id: Number(id) } });
        if (!photo) {
            return res.status(404).json({ error: "Fotoğraf bulunamadı" });
        }
        await photoRepo.remove(photo);
        return res.status(200).json({ message: "Fotoğraf başarıyla silindi" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.deletePhoto = deletePhoto;
const postSinglePhoto = async (req, res) => {
    try {
        const photoRepo = database_1.default.getRepository(photo_entity_1.default);
        if (!req.file) {
            return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
        }
        const photo = new photo_entity_1.default();
        photo.data = req.file.buffer;
        photo.mimeType = req.file.mimetype;
        photo.isShared = false;
        await photoRepo.save(photo);
        return res.status(201).json({ message: "Fotoğraf başarıyla yüklendi", id: photo.id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
exports.postSinglePhoto = postSinglePhoto;
