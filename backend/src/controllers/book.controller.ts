import type { Request, Response } from "express";

import db from "~/database";
import Book from "~/database/book.entity";

import generateSlug from "~/utils/generateSlug";

export const getBook = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || undefined; // opsiyonel limit
        const panel = req.query.panel === "true"; // Check for panel parameter
        const bookRepo = db.getRepository(Book);

        const books = await bookRepo.find({
            where: panel ? {} : { isApproved: true }, // Include unapproved books if panel is true
            select: ["id", "title", "slug", "author", "isApproved"],
            take: limit,
            order: { id: "DESC" }
        });

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getBookWithSlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params
        const pageRepo = db.getRepository(Book);
        const news = await pageRepo.findOne({ where: [{ slug }] });
        console.log(news, slug);

        res.status(200).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const postBook = async (req: Request, res: Response) => {
    try {
        const { title, content, author } = req.body
        const user = res.locals.user

        const newRepository = db.getRepository(Book)

        const existing = await newRepository.findOneBy({ title });
        if (existing) return res.status(400).json({ message: "Sayfa zaten mevcut" });
        const slug = generateSlug(title)
        const post = newRepository.create({
            title,
            content,
            slug,
            author,
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

export const putBook = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { title, content, author } = req.body;
        const newRepo = db.getRepository(Book);

        const news = await newRepo.findOneBy({ slug });
        if (!news) return res.status(404).json({ message: "Sayfa bulunamadı" });

        news.title = title ?? news.title;
        news.content = content ?? news.content;
        news.slug = generateSlug(title) ?? news.slug
        news.author = author ?? news.author

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

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newsRepo = db.getRepository(Book);

        const news = await newsRepo.findOneBy({ id: Number(id) });
        if (!news) return res.status(404).json({ message: "Sayfa bulunamadı" });

        await newsRepo.remove(news);
        res.status(200).json({ message: "Sayfa silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const approveBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bookRepo = db.getRepository(Book);

        const book = await bookRepo.findOneBy({ id: Number(id) });
        if (!book) return res.status(404).json({ message: "Kitap bulunamadı" });

        book.isApproved = true;
        await bookRepo.save(book);

        res.status(200).json({ message: "Kitap onaylandı", book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
