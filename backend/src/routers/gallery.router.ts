import { Router } from "express";

import { showNewsCover, showBookCover, postPhotoArray, showPhoto, listPhotoIds, deletePhoto, showUserPhoto, postSinglePhoto } from "~/controllers/gallery.controller";
import authMiddleware from "~/middlewares/auth.middleware";
import checkPermission from "~/middlewares/checkPermission.middleware";
import uploadMiddleware from "~/middlewares/upload.middleware";

const router = Router();

router.get("/cover/news/:id", showNewsCover)
router.get("/cover/book/:id", showBookCover)
router.get("/user/:id", showUserPhoto)

router.get("/ids", listPhotoIds)
router.get("/:id", showPhoto)
router.post("/", authMiddleware, checkPermission("canManageGallery"), uploadMiddleware.array("photo"), postPhotoArray)
router.delete("/:id", authMiddleware, checkPermission("canManageGallery"), deletePhoto);

router.post("/photo", uploadMiddleware.single("photo"), postSinglePhoto);

export default router