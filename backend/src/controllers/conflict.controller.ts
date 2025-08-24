// controllers/conflict.controller.ts
import type { Request, Response } from "express";
import db from "~/database";
import Conflict from "~/database/conflict.entity";
import generateSlug from "~/utils/generateSlug";

// Tüm conflictleri listele
export const getConflicts = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || undefined; // opsiyonel limit
        const panel = req.query.panel === "true"; // Check for panel parameter
        const conflictRepo = db.getRepository(Conflict);

        const conflicts = await conflictRepo.find({
            where: panel ? {} : { isApproved: true }, // Include unapproved conflicts if panel is true
            select: ["id", "title", "slug", "isApproved"],
            take: limit,
            order: { id: "DESC" } // en yeni önce
        });

        res.status(200).json(conflicts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Tek conflict getirme
export const getConflictWithSlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const conflictRepo = db.getRepository(Conflict);
        const conflict = await conflictRepo.findOne({ where: { slug } });
        if (!conflict) return res.status(404).json({ message: "Conflict bulunamadı" });
        res.status(200).json(conflict);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Yeni conflict oluştur
export const postConflict = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const conflictRepo = db.getRepository(Conflict);
        const user = res.locals.user;
        const existing = await conflictRepo.findOne({ where: { title } });
        if (existing) return res.status(400).json({ message: "Conflict zaten mevcut" });

        const slug = generateSlug(title);

        const conflict = conflictRepo.create({ title, content, slug, user });
        await conflictRepo.save(conflict);

        res.status(201).json(conflict);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Conflict güncelle
export const putConflict = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { name: title, content } = req.body;
        const conflictRepo = db.getRepository(Conflict);

        const conflict = await conflictRepo.findOne({ where: { slug } });
        if (!conflict) return res.status(404).json({ message: "Conflict bulunamadı" });

        conflict.title = title ?? conflict.title;
        conflict.content = content ?? conflict.content;
        conflict.slug = generateSlug(title) ?? conflict.slug;

        await conflictRepo.save(conflict);
        res.status(200).json(conflict);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Conflict sil
export const deleteConflict = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const conflictRepo = db.getRepository(Conflict);

        const conflict = await conflictRepo.findOne({ where: { id: Number(id) } });
        if (!conflict) return res.status(404).json({ message: "Conflict bulunamadı" });

        await conflictRepo.remove(conflict);
        res.status(200).json({ message: "Conflict silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const approveConflict = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const conflictRepo = db.getRepository(Conflict);

        const conflict = await conflictRepo.findOne({ where: { id: Number(id) } });
        if (!conflict) return res.status(404).json({ message: "Conflict bulunamadı" });

        conflict.isApproved = true;
        await conflictRepo.save(conflict);

        res.status(200).json({ message: "Conflict onaylandı", conflict });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};