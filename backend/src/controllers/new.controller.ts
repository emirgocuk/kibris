import type { Request, Response } from "express";

import db from "~/database";
import New from "~/database/new.entity";

import generateSlug from "~/utils/generateSlug";


export const getNews = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || undefined; // opsiyonel
        const panel = req.query.panel === "true"; // Check for panel parameter
        const pageRepo = db.getRepository(New);

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getNewWithSlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params
        const pageRepo = db.getRepository(New);
        const news = await pageRepo.findOne({ where: [{ slug }] });
        console.log(news, slug);

        res.status(200).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const postNew = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body
        const user = res.locals.user

        const newRepository = db.getRepository(New)

        const existing = await newRepository.findOneBy({ title });
        if (existing) return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const slug = generateSlug(title)
        const post = newRepository.create({
            title,
            content,
            slug,
            user
        })

        if (req.file) {
            post.cover = req.file.buffer
        }

        await newRepository.save(post)

        res.status(200).json({ post });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" });
    }
}

export const putNew = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;
        const newRepo = db.getRepository(New);

        const news = await newRepo.findOneBy({ slug });
        if (!news) return res.status(404).json({ message: "Sayfa bulunamadı" });

        news.title = title ?? news.title;
        news.content = content ?? news.content;
        news.slug = generateSlug(title) ?? news.slug

        if (req.file) {
            news.cover = req.file.buffer
        }

        console.log(slug);


        await newRepo.save(news);
        res.status(200).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const deleteNew = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newsRepo = db.getRepository(New);

        const news = await newsRepo.findOneBy({ id: Number(id) });
        if (!news) return res.status(404).json({ message: "Sayfa bulunamadı" });

        await newsRepo.remove(news);
        res.status(200).json({ message: "Sayfa silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const approveNew = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newRepo = db.getRepository(New);

        const news = await newRepo.findOneBy({ id: Number(id) });
        if (!news) return res.status(404).json({ message: "Haber bulunamadı" });

        news.isApproved = true;
        await newRepo.save(news);

        res.status(200).json({ message: "Haber onaylandı", news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
