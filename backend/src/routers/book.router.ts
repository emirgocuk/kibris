import { Router } from "express";
import { getBook, getBookWithSlug, postBook, putBook, deleteBook, approveBook } from "~/controllers/book.controller";

import checkPermission from "~/middlewares/checkPermission.middleware";
import authMiddleware from "~/middlewares/auth.middleware";
import uploadMiddleware from "~/middlewares/upload.middleware";

const router = Router();

router.get("/", getBook)
router.get("/:slug", getBookWithSlug)
router.post("/", authMiddleware, uploadMiddleware.single("photo"), checkPermission("canManagePages"), postBook)
router.put("/:slug", authMiddleware, uploadMiddleware.single("photo"), checkPermission("canManagePages"), putBook)
router.delete("/:id", authMiddleware, uploadMiddleware.single("photo"), checkPermission("canManagePages"), deleteBook)
router.put("/approve/:id", authMiddleware, checkPermission("canApprovePost"), approveBook)

export default router