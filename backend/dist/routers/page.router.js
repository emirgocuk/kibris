"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const page_controller_1 = require("../controllers/page.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", page_controller_1.getPages);
router.get("/:slug", page_controller_1.getPageWithSlug);
router.post("/", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManagePages"), page_controller_1.postPage);
router.put("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManagePages"), page_controller_1.putPage);
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManagePages"), page_controller_1.deletePage);
exports.default = router;
