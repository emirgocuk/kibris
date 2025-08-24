import { Router } from "express";
import {

    listUsers,
    getUser,
    updateUser,
    deleteUser, createUser
} from "~/controllers/user.controller";

import authMiddleware from "~/middlewares/auth.middleware";
import checkPermission from "~/middlewares/checkPermission.middleware";
import uploadMiddleware from "~/middlewares/upload.middleware";

const router = Router();

// Tüm kullanıcıları listele (sadece yetkili)
router.get("/", listUsers);

// Tek kullanıcıyı getir (sadece yetkili veya kendisi)
router.get("/:id", getUser);

// Yeni kullanıcı oluştur (admin yetkisi gerekli)
router.post("/", authMiddleware, checkPermission("canManageUsers"), uploadMiddleware.single("photo"), createUser);

// Kullanıcı güncelle (admin veya kendisi)
router.put("/:id", authMiddleware, checkPermission("canManageUsers"), uploadMiddleware.single("photo"), updateUser);

// Kullanıcı sil (admin yetkisi gerekli)
router.delete("/:id", authMiddleware, checkPermission("canManageUsers"), deleteUser);

export default router;
