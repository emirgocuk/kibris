import type { Request, Response } from "express";
import db from "~/database";
import Page from "~/database/page.entity";
import { ILike } from "typeorm";

export const searchAll = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "Arama kelimesi eksik" });
        }

        const MAX_RESULTS = 10;

        const pageRepo = db.getRepository(Page);


        const pages = await pageRepo.find({
            where: [
                { title: ILike(`%${q}%`) },
                { content: ILike(`%${q}%`) }
            ],
            take: MAX_RESULTS
        });


        let combinedResults = [...pages].slice(0, MAX_RESULTS);

        res.status(200).json({
            total: combinedResults.length,
            results: combinedResults
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
