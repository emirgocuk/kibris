"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = (0, express_1.Router)();
// Tüm kullanıcıları listele (sadece yetkili)
router.get("/", user_controller_1.listUsers);
// Tek kullanıcıyı getir (sadece yetkili veya kendisi)
router.get("/:id", user_controller_1.getUser);
// Yeni kullanıcı oluştur (admin yetkisi gerekli)
router.post("/", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageUsers"), upload_middleware_1.default.single("photo"), user_controller_1.createUser);
// Kullanıcı güncelle (admin veya kendisi)
router.put("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageUsers"), upload_middleware_1.default.single("photo"), user_controller_1.updateUser);
// Kullanıcı sil (admin yetkisi gerekli)
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageUsers"), user_controller_1.deleteUser);
exports.default = router;
