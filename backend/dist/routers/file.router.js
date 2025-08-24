"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_controller_1 = require("../controllers/file.controller");
const router = (0, express_1.Router)();
router.get("/cover/:id", file_controller_1.showCover);
exports.default = router;
