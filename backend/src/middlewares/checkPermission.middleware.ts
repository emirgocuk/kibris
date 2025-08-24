import type { Request, Response, NextFunction } from "express";
import Role from "~/database/role.entity"; // ✅ tip olarak import

export default function checkPermission(permission: keyof Role) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user;

            if (!user.role[permission]) {
                return res.status(403).json({ code: 403, message: "Yetkisiz işlem" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ code: 401, message: "Yetkisiz Giriş" });
        }
    };
}
