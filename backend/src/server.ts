import express, { type Express } from "express";

import dotenv from "dotenv";
import cors from 'cors';

import db, { seedInitialData } from "~/database"

import authRouter from "~/routers/auth.router"
import roleRouter from "~/routers/role.router"
import pageRouter from "~/routers/page.router"
import searchRouter from "~/routers/search.router"
import galleryRouter from "~/routers/gallery.router"
import announcementRouter from "~/routers/announcement.router"
import newsRouter from "~/routers/news.router"
import bookRouter from "~/routers/book.router"
import userRouter from "~/routers/user.router"
import conflictRouter from "~/routers/conflict.router"

dotenv.config();

db.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        await seedInitialData()
    })
    .catch((error) => console.error("Error during Data Source initialization", error));

const app: Express = express();

app.use(express.json());
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    })
);

app.use(cors({

}));

// Referrer-Policy header ekleme
app.use((req, res, next) => {
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
});

app.use("/auth", authRouter);
app.use("/page", pageRouter);
app.use("/news", newsRouter);
app.use("/books", bookRouter);
app.use("/announcement", announcementRouter);
app.use("/conflict", conflictRouter);

app.use("/role", roleRouter);
app.use("/search", searchRouter);
app.use("/gallery", galleryRouter);
app.use("/user", userRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});