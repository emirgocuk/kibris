"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const checkPermission_middleware_1 = __importDefault(require("../middlewares/checkPermission.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", role_controller_1.getRoles);
router.post("/", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageRoles"), role_controller_1.postRole);
router.put("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageRoles"), role_controller_1.putRole);
router.delete("/:id", auth_middleware_1.default, (0, checkPermission_middleware_1.default)("canManageRoles"), role_controller_1.deleteRole);
exports.default = router;
