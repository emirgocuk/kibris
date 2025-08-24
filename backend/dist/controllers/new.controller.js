"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveNew = exports.deleteNew = exports.putNew = exports.postNew = exports.getNewWithSlug = exports.getNews = void 0;
const database_1 = __importDefault(require("../database"));
const new_entity_1 = __importDefault(require("../database/new.entity"));
const generateSlug_1 = __importDefault(require("../utils/generateSlug"));
const getNews = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined; // opsiyonel
        const panel = req.query.panel === "true"; // Check for panel parameter
        const pageRepo = database_1.default.getRepository(new_entity_1.default);
        const pages = await pageRepo.find({
            where: panel ? {} : { isApproved: true }, // Include unapproved news if panel is true
            select: ["id", "title", "slug", "content", "isApproved"],
            take: limit,
            order: { id: "DESC" }, // son eklenenler önce
        });
        const result = pages.map(page => ({
            ...page,
            content: page.content.slice(0, 255),
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getNews = getNews;
const getNewWithSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pageRepo = database_1.default.getRepository(new_entity_1.default);
        const news = await pageRepo.findOne({ where: [{ slug }] });
        console.log(news, slug);
        res.status(200).json(news);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getNewWithSlug = getNewWithSlug;
const postNew = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = res.locals.user;
        const newRepository = database_1.default.getRepository(new_entity_1.default);
        const existing = await newRepository.findOneBy({ title });
        if (existing)
            return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const slug = (0, generateSlug_1.default)(title);
        const post = newRepository.create({
            title,
            content,
            slug,
            user
        });
        if (req.file) {
            post.cover = req.file.buffer;
        }
        await newRepository.save(post);
        res.status(200).json({ post });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.postNew = postNew;
const putNew = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;
        const newRepo = database_1.default.getRepository(new_entity_1.default);
        const news = await newRepo.findOneBy({ slug });
        if (!news)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        news.title = title ?? news.title;
        news.content = content ?? news.content;
        news.slug = (0, generateSlug_1.default)(title) ?? news.slug;
        if (req.file) {
            news.cover = req.file.buffer;
        }
        console.log(slug);
        await newRepo.save(news);
        res.status(200).json(news);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putNew = putNew;
const deleteNew = async (req, res) => {
    try {
        const { id } = req.params;
        const newsRepo = database_1.default.getRepository(new_entity_1.default);
        const news = await newsRepo.findOneBy({ id: Number(id) });
        if (!news)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        await newsRepo.remove(news);
        res.status(200).json({ message: "Sayfa silindi" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteNew = deleteNew;
const approveNew = async (req, res) => {
    try {
        const { id } = req.params;
        const newRepo = database_1.default.getRepository(new_entity_1.default);
        const news = await newRepo.findOneBy({ id: Number(id) });
        if (!news)
            return res.status(404).json({ message: "Haber bulunamadı" });
        news.isApproved = true;
        await newRepo.save(news);
        res.status(200).json({ message: "Haber onaylandı", news });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.approveNew = approveNew;
