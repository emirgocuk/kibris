"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveBook = exports.deleteBook = exports.putBook = exports.postBook = exports.getBookWithSlug = exports.getBook = void 0;
const database_1 = __importDefault(require("../database"));
const book_entity_1 = __importDefault(require("../database/book.entity"));
const generateSlug_1 = __importDefault(require("../utils/generateSlug"));
const getBook = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined; // opsiyonel limit
        const panel = req.query.panel === "true"; // Check for panel parameter
        const bookRepo = database_1.default.getRepository(book_entity_1.default);
        const books = await bookRepo.find({
            where: panel ? {} : { isApproved: true }, // Include unapproved books if panel is true
            select: ["id", "title", "slug", "author", "isApproved"],
            take: limit,
            order: { id: "DESC" }
        });
        res.status(200).json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getBook = getBook;
const getBookWithSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pageRepo = database_1.default.getRepository(book_entity_1.default);
        const news = await pageRepo.findOne({ where: [{ slug }] });
        console.log(news, slug);
        res.status(200).json(news);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getBookWithSlug = getBookWithSlug;
const postBook = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const user = res.locals.user;
        const newRepository = database_1.default.getRepository(book_entity_1.default);
        const existing = await newRepository.findOneBy({ title });
        if (existing)
            return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const slug = (0, generateSlug_1.default)(title);
        const post = newRepository.create({
            title,
            content,
            slug,
            author,
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
exports.postBook = postBook;
const putBook = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content, author } = req.body;
        const newRepo = database_1.default.getRepository(book_entity_1.default);
        const news = await newRepo.findOneBy({ slug });
        if (!news)
            return res.status(404).json({ message: "Sayfa bulunamadı" });
        news.title = title ?? news.title;
        news.content = content ?? news.content;
        news.slug = (0, generateSlug_1.default)(title) ?? news.slug;
        news.author = author ?? news.author;
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
exports.putBook = putBook;
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const newsRepo = database_1.default.getRepository(book_entity_1.default);
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
exports.deleteBook = deleteBook;
const approveBook = async (req, res) => {
    try {
        const { id } = req.params;
        const bookRepo = database_1.default.getRepository(book_entity_1.default);
        const book = await bookRepo.findOneBy({ id: Number(id) });
        if (!book)
            return res.status(404).json({ message: "Kitap bulunamadı" });
        book.isApproved = true;
        await bookRepo.save(book);
        res.status(200).json({ message: "Kitap onaylandı", book });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.approveBook = approveBook;
