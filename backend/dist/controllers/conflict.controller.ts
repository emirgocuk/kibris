"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.putPage = exports.postPage = exports.getPage = void 0;
const database_1 = __importDefault(require("../database"));
const page_entity_1 = __importDefault(require("../database/page.entity"));
// Tüm sayfalar
const getPage = async (req, res) => {
    try {
        const { title } = req.params;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const pages = await pageRepo.findOne({ where: [{ title }] });
        res.status(200).json(pages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPage = getPage;
// Yeni sayfa oluşturma
const postPage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const existing = await pageRepo.findOneBy({ title });
        if (existing)
            return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const page = pageRepo.create({
            title,
            content
        });
        await pageRepo.save(page);
        res.status(201).json(page);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.postPage = postPage;
// Sayfa güncelleme
const putPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const page = await pageRepo.findOneBy({ id: Number(id) });
        if (!page)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        page.title = title ?? page.title;
        page.content = content ?? page.content;
        await pageRepo.save(page);
        res.status(200).json(page);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putPage = putPage;
// Sayfa silme
const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const page = await pageRepo.findOneBy({ id: Number(id) });
        if (!page)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        await pageRepo.remove(page);
        res.status(200).json({ message: "Sayfa silindi" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deletePage = deletePage;
