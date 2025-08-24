"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAll = void 0;
const database_1 = __importDefault(require("../database"));
const page_entity_1 = __importDefault(require("../database/page.entity"));
const typeorm_1 = require("typeorm");
const searchAll = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "Arama kelimesi eksik" });
        }
        const MAX_RESULTS = 10;
        const pageRepo = database_1.default.getRepository(page_entity_1.default);
        const pages = await pageRepo.find({
            where: [
                { title: (0, typeorm_1.ILike)(`%${q}%`) },
                { content: (0, typeorm_1.ILike)(`%${q}%`) }
            ],
            take: MAX_RESULTS
        });
        let combinedResults = [...pages].slice(0, MAX_RESULTS);
        res.status(200).json({
            total: combinedResults.length,
            results: combinedResults
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.searchAll = searchAll;
