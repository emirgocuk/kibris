"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = (0, express_1.Router)();
router.get("/", book_controller_1.getBook);
router.get("/:slug", book_controller_1.getBookWithSlug);
router.post("/", auth_middleware_1.default, upload_middleware_1.default.single("photo"), (0, checkPermission_middleware_1.default)("canManagePages"), book_controller_1.postBook);
router.put("/:slug", auth_middleware_1.default, upload_middleware_1.default.single("photo"), (0, checkPermission_middleware_1.default)("canManagePages"), book_controller_1.putBook);
router.delete("/:id", auth_middleware_1.default, upload_middleware_1.default.single("photo"), (0, checkPermission_middleware_1.default)("canManagePages"), book_controller_1.deleteBook);
router.put("/approve/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canApprovePost"), book_controller_1.approveBook);
exports.default = router;
