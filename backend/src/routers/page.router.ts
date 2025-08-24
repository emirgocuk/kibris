import { Router } from "express";
import { getPages, getPageWithSlug, postPage, putPage, deletePage } from "~/controllers/page.controller";

import checkPermission from "~/middlewares/checkPermission.middleware";
import authMiddleware from "~/middlewares/auth.middleware";

const router = Router();

router.get("/", getPages)
router.get("/:slug", getPageWithSlug)
router.post("/", authMiddleware, checkPermission("canManagePages"), postPage)
router.put("/:id", authMiddleware, checkPermission("canManagePages"), putPage)
router.delete("/:id", authMiddleware, checkPermission("canManagePages"), deletePage)

export default router