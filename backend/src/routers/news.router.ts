import { Router } from "express";
import { getNews, getNewWithSlug, postNew, putNew, deleteNew, approveNew } from "~/controllers/new.controller";

import checkPermission from "~/middlewares/checkPermission.middleware";
import authMiddleware from "~/middlewares/auth.middleware";
import uploadMiddleware from "~/middlewares/upload.middleware";

const router = Router();

router.get("/", getNews)
router.get("/:slug", getNewWithSlug)
router.post("/", authMiddleware, uploadMiddleware.single("photo"), checkPermission("canCreateNews"), postNew)
router.put("/:slug", authMiddleware, uploadMiddleware.single("photo"), checkPermission("canEditNews"), putNew)
router.delete("/:id", authMiddleware, checkPermission("canDeleteNews"), deleteNew)
router.put("/approve/:id", authMiddleware, checkPermission("canApprovePost"), approveNew)

export default router