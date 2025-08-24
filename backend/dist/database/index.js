"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const user_entity_1 = __importDefault(require("../database/user.entity"));
const token_entity_1 = __importDefault(require("../database/token.entity"));
const page_entity_1 = __importDefault(require("../database/page.entity"));
const new_entity_1 = __importDefault(require("../database/new.entity"));
const book_entity_1 = __importDefault(require("../database/book.entity"));
const photo_entity_1 = __importDefault(require("../database/photo.entity"));
const conflict_entity_1 = __importDefault(require("../database/conflict.entity"));
const guest_entity_1 = __importDefault(require("./guest.entity"));
const role_entity_1 = __importDefault(require("../database/role.entity"));
const announcement_entity_1 = __importDefault(require("../database/announcement.entity"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [user_entity_1.default, token_entity_1.default, page_entity_1.default, new_entity_1.default, book_entity_1.default, role_entity_1.default, announcement_entity_1.default, photo_entity_1.default, conflict_entity_1.default, guest_entity_1.default],
});
async function seedInitialData() {
    const roleRepo = AppDataSource.getRepository(role_entity_1.default);
    const userRepo = AppDataSource.getRepository(user_entity_1.default);
    const roles = [
        { name: "superadmin", canCreatePost: true, canEditPost: true, canDeletePost: true, canApprovePost: true, canManagePages: true, canManageRoles: false },
        { name: "admin", canCreatePost: true, canEditPost: true, canDeletePost: true, canApprovePost: true, canManagePages: false, canManageRoles: false },
        { name: "author", canCreatePost: true, canEditPost: true, canDeletePost: false, canApprovePost: false, canManagePages: false, canManageRoles: false },
        { name: "user", canCreatePost: false, canEditPost: false, canDeletePost: false, canApprovePost: false, canManagePages: false, canManageRoles: false },
    ];
    for (const r of roles) {
        const exists = await roleRepo.findOneBy({ name: r.name });
        if (!exists) {
            const role = roleRepo.create(r);
            await roleRepo.save(role);
        }
    }
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const exists = await userRepo.findOneBy({ name: adminName, email: adminEmail });
    if (!exists) {
        const admin = new user_entity_1.default();
        admin.name = adminName;
        admin.email = adminEmail;
        admin.password = await bcrypt_1.default.hash(adminPassword, 10);
        admin.roleId = 1;
        await userRepo.save(admin);
    }
}
exports.default = AppDataSource;
