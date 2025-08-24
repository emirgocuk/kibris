import type { Request, Response } from "express";
import db from "~/database";
import Page from "~/database/page.entity";

import generateSlug from "~/utils/generateSlug";

export const getPages = async (req: Request, res: Response) => {
    try {
        const pageRepo = db.getRepository(Page);
        const pages = await pageRepo.find({ select: ["id", "title", "slug"] }); // <- Eksik olan kısım burasıydı

        res.status(200).json(pages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getPageWithSlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params
        const pageRepo = db.getRepository(Page);
        const pages = await pageRepo.findOne({ where: [{ slug }] });
        console.log(pages, slug);

        res.status(200).json(pages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const postPage = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const pageRepo = db.getRepository(Page);

        const existing = await pageRepo.findOneBy({ title });
        if (existing) return res.status(400).json({ message: "Sayfa zaten mevcut" });

        const slug = generateSlug(title)

        const page = pageRepo.create({
            title,
            content,
            slug
        });

        await pageRepo.save(page);
        res.status(201).json(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const putPage = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;
        const pageRepo = db.getRepository(Page);

        const page = await pageRepo.findOneBy({ slug });
        if (!page) return res.status(404).json({ message: "Sayfa bulunamadı" });

        page.title = title ?? page.title;
        page.content = content ?? page.content;
        page.slug = generateSlug(title) ?? page.slug


        await pageRepo.save(page);
        res.status(200).json(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const deletePage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pageRepo = db.getRepository(Page);

        const page = await pageRepo.findOneBy({ id: Number(id) });
        if (!page) return res.status(404).json({ message: "Sayfa bulunamadı" });

        await pageRepo.remove(page);
        res.status(200).json({ message: "Sayfa silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}
