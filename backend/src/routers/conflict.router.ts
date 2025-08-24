import { Router } from "express";
import {
    getConflicts,
    getConflictWithSlug,
    postConflict,
    putConflict,
    deleteConflict,
    approveConflict
} from "~/controllers/conflict.controller";
import checkPermission from "~/middlewares/checkPermission.middleware";

import authMiddleware from "~/middlewares/auth.middleware";

const router = Router();

router.get("/", getConflicts);

router.get("/:slug", getConflictWithSlug);

router.post("/", authMiddleware, postConflict);

router.put("/:id", authMiddleware, putConflict);

router.delete("/:id", authMiddleware, deleteConflict);

router.put("/approve/:id", authMiddleware, checkPermission("canApprovePost"), approveConflict)

export default router;
