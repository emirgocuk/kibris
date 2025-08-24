"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.putCategory = exports.postCategory = exports.getCategory = void 0;
const database_1 = __importDefault(require("../database"));
const category_entity_1 = __importDefault(require("../database/category.entity"));
// Tüm kategorileri getir
const getCategory = async (_req, res) => {
    try {
        const categoryRepo = database_1.default.getRepository(category_entity_1.default);
        const categories = await categoryRepo.find();
        res.status(200).json({ categories });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getCategory = getCategory;
// Yeni kategori ekle
const postCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryRepo = database_1.default.getRepository(category_entity_1.default);
        const existing = await categoryRepo.findOneBy({ name });
        if (existing)
            return res.status(400).json({ message: "Kategori zaten mevcut" });
        const category = categoryRepo.create({ name }); // description kaldırıldı
        await categoryRepo.save(category);
        res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.postCategory = postCategory;
// Var olan kategoriyi güncelle
const putCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const categoryRepo = database_1.default.getRepository(category_entity_1.default);
        const category = await categoryRepo.findOneBy({ id: Number(id) });
        if (!category)
            return res.status(404).json({ message: "Kategori bulunamadı" });
        category.name = name ?? category.name; // description kaldırıldı
        await categoryRepo.save(category);
        res.status(200).json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putCategory = putCategory;
// Kategoriyi sil
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryRepo = database_1.default.getRepository(category_entity_1.default);
        const category = await categoryRepo.findOneBy({ id: Number(id) });
        if (!category)
            return res.status(404).json({ message: "Kategori bulunamadı" });
        if (["default", "uncategorized"].includes(category.name.toLowerCase())) {
            return res.status(403).json({ message: "Bu kategori silinemez" });
        }
        await categoryRepo.remove(category);
        res.status(200).json({ message: "Kategori silindi" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteCategory = deleteCategory;
