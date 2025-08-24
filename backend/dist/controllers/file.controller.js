"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCover = void 0;
const database_1 = __importDefault(require("../database"));
const post_entity_1 = __importDefault(require("../database/post.entity"));
const showCover = async (req, res) => {
    try {
        const { id } = req.params;
        const postRepository = database_1.default.getRepository(post_entity_1.default);
        const post = await postRepository.findOne({
            where: { id: Number(id) },
            select: ["cover"],
            order: { id: "DESC" }
        });
        res.setHeader("Content-Type", "image/jpeg");
        res.end(post?.cover);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.showCover = showCover;
