"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveConflict = exports.deleteConflict = exports.putConflict = exports.postConflict = exports.getConflictWithSlug = exports.getConflicts = void 0;
const database_1 = __importDefault(require("../database"));
const conflict_entity_1 = __importDefault(require("../database/conflict.entity"));
const generateSlug_1 = __importDefault(require("../utils/generateSlug"));
// Tüm conflictleri listele
const getConflicts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined; // opsiyonel limit
        const panel = req.query.panel === "true"; // Check for panel parameter
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const conflicts = await conflictRepo.find({
            where: panel ? {} : { isApproved: true }, // Include unapproved conflicts if panel is true
            select: ["id", "title", "slug", "isApproved"],
            take: limit,
            order: { id: "DESC" } // en yeni önce
        });
        res.status(200).json(conflicts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getConflicts = getConflicts;
// Tek conflict getirme
const getConflictWithSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const conflict = await conflictRepo.findOne({ where: { slug } });
        if (!conflict)
            return res.status(404).json({ message: "Conflict bulunamadı" });
        res.status(200).json(conflict);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getConflictWithSlug = getConflictWithSlug;
// Yeni conflict oluştur
const postConflict = async (req, res) => {
    try {
        const { title, content } = req.body;
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const user = res.locals.user;
        const existing = await conflictRepo.findOne({ where: { title } });
        if (existing)
            return res.status(400).json({ message: "Conflict zaten mevcut" });
        const slug = (0, generateSlug_1.default)(title);
        const conflict = conflictRepo.create({ title, content, slug, user });
        await conflictRepo.save(conflict);
        res.status(201).json(conflict);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.postConflict = postConflict;
// Conflict güncelle
const putConflict = async (req, res) => {
    try {
        const { slug } = req.params;
        const { name: title, content } = req.body;
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const conflict = await conflictRepo.findOne({ where: { slug } });
        if (!conflict)
            return res.status(404).json({ message: "Conflict bulunamadı" });
        conflict.title = title ?? conflict.title;
        conflict.content = content ?? conflict.content;
        conflict.slug = (0, generateSlug_1.default)(title) ?? conflict.slug;
        await conflictRepo.save(conflict);
        res.status(200).json(conflict);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.putConflict = putConflict;
// Conflict sil
const deleteConflict = async (req, res) => {
    try {
        const { id } = req.params;
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const conflict = await conflictRepo.findOne({ where: { id: Number(id) } });
        if (!conflict)
            return res.status(404).json({ message: "Conflict bulunamadı" });
        await conflictRepo.remove(conflict);
        res.status(200).json({ message: "Conflict silindi" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteConflict = deleteConflict;
const approveConflict = async (req, res) => {
    try {
        const { id } = req.params;
        const conflictRepo = database_1.default.getRepository(conflict_entity_1.default);
        const conflict = await conflictRepo.findOne({ where: { id: Number(id) } });
        if (!conflict)
            return res.status(404).json({ message: "Conflict bulunamadı" });
        conflict.isApproved = true;
        await conflictRepo.save(conflict);
        res.status(200).json({ message: "Conflict onaylandı", conflict });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.approveConflict = approveConflict;
