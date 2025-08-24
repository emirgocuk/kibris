"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const announcement_controller_1 = require("../controllers/announcement.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const router = (0, express_1.Router)();
router.get("/", announcement_controller_1.getAnnouncements);
router.get("/:id", announcement_controller_1.getAnnouncementById);
router.post("/", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageAnnouncements"), announcement_controller_1.postAnnouncement);
router.put("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageAnnouncements"), announcement_controller_1.putAnnouncement);
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageAnnouncements"), announcement_controller_1.deleteAnnouncement);
exports.default = router;
