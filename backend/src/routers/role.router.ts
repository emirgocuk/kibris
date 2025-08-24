import { Router } from "express";
import { getRoles, postRole, putRole, deleteRole } from "~/controllers/role.controller";

import checkPermission from "~/middlewares/checkPermission.middleware";
import authMiddleware from "~/middlewares/auth.middleware";

const router = Router();

router.get("/", getRoles)
router.post("/", authMiddleware, checkPermission("canManageRoles"), postRole)
router.put("/:id", authMiddleware, checkPermission("canManageRoles"), putRole)
router.delete("/:id", authMiddleware, checkPermission("canManageRoles"), deleteRole)

export default router