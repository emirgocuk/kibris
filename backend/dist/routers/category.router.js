"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
// Tüm kategorileri getir
router.get("/", category_controller_1.getCategory);
// Yeni kategori ekle (yetki kontrolü)
router.post("/", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageCategories"), category_controller_1.postCategory);
// Var olan kategoriyi güncelle
router.put("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageCategories"), category_controller_1.putCategory);
// Kategoriyi sil
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageCategories"), category_controller_1.deleteCategory);
exports.default = router;
