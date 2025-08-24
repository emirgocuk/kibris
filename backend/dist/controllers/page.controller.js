"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.putPage = exports.postPage = exports.getPageWithSlug = exports.getPages = void 0;
const database_1 = __importDefault(require("../database"));
const page_entity_1 = __importDefault(require("../database/page.entity"));
const generateSlug_1 = __importDefault(require("../utils/generateSlug"));
const getPages = async (req, res) => {
    try {
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const pages = await pageRepo.find({ select: ["id", "title", "slug"] }); // <- Eksik olan kısım burasıydı
        res.status(200).json(pages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPages = getPages;
const getPageWithSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const pages = await pageRepo.findOne({ where: [{ slug }] });
        console.log(pages, slug);
        res.status(200).json(pages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPageWithSlug = getPageWithSlug;
const postPage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const existing = await pageRepo.findOneBy({ title });
        if (existing)
            return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const slug = (0, generateSlug_1.default)(title);
        const page = pageRepo.create({
            title,
            content,
            slug
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
const putPage = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const page = await pageRepo.findOneBy({ slug });
        if (!page)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        page.title = title ?? page.title;
        page.content = content ?? page.content;
        page.slug = (0, generateSlug_1.default)(title) ?? page.slug;
        await pageRepo.save(page);
        res.status(200).json(page);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putPage = putPage;
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
