"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conflict_controller_1 = require("../controllers/conflict.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", conflict_controller_1.getConflicts);
router.get("/:slug", conflict_controller_1.getConflictWithSlug);
router.post("/", auth_middleware_1.default, conflict_controller_1.postConflict);
router.put("/:id", auth_middleware_1.default, conflict_controller_1.putConflict);
router.delete("/:id", auth_middleware_1.default, conflict_controller_1.deleteConflict);
router.put("/approve/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canApprovePost"), conflict_controller_1.approveConflict);
exports.default = router;
