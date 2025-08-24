import { Router } from "express";
import { register, login, auth } from "~/controllers/auth.controller";

import validateMiddleware from "~/middlewares/validate.middleware";
import authMiddleware from "~/middlewares/auth.middleware";

import { registerSchema, loginSchema } from "~/schemas/auth.schema"

const router = Router();

router.get("/", authMiddleware, auth)
router.post("/register", validateMiddleware(registerSchema), register)
router.post("/login", validateMiddleware(loginSchema), login)

export default router