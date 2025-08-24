"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkPermission;
function checkPermission(permission) {
    return async (req, res, next) => {
        try {
            const user = res.locals.user;
            if (!user.role[permission]) {
                return res.status(403).json({ code: 403, message: "Yetkisiz işlem" });
            }
            next();
        }
        catch (err) {
            return res.status(401).json({ code: 401, message: "Yetkisiz Giriş" });
        }
    };
}
