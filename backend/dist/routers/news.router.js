"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const new_controller_1 = require("../controllers/new.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = (0, express_1.Router)();
router.get("/", new_controller_1.getNews);
router.get("/:slug", new_controller_1.getNewWithSlug);
router.post("/", auth_middleware_1.default, upload_middleware_1.default.single("photo"), (0, checkPermission_middleware_1.default)("canCreateNews"), new_controller_1.postNew);
router.put("/:slug", auth_middleware_1.default, upload_middleware_1.default.single("photo"), (0, checkPermission_middleware_1.default)("canEditNews"), new_controller_1.putNew);
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canDeleteNews"), new_controller_1.deleteNew);
router.put("/approve/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canApprovePost"), new_controller_1.approveNew);
exports.default = router;
