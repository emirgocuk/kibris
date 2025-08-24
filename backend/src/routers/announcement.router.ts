import { Router } from "express";
import {
    getAnnouncements,
    getAnnouncementById,
    postAnnouncement,
    putAnnouncement,
    deleteAnnouncement
} from "~/controllers/announcement.controller";

import authMiddleware from "~/middlewares/auth.middleware";
import checkPermission from "~/middlewares/checkPermission.middleware";

const router = Router();

router.get("/", getAnnouncements);

router.get("/:id", getAnnouncementById);

router.post("/", authMiddleware, checkPermission("canManageAnnouncements"), postAnnouncement);

router.put("/:id", authMiddleware, checkPermission("canManageAnnouncements"), putAnnouncement);

router.delete("/:id", authMiddleware, checkPermission("canManageAnnouncements"), deleteAnnouncement);

export default router;
