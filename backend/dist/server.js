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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importStar(require("./database"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const role_router_1 = __importDefault(require("./routers/role.router"));
const page_router_1 = __importDefault(require("./routers/page.router"));
const search_router_1 = __importDefault(require("./routers/search.router"));
const gallery_router_1 = __importDefault(require("./routers/gallery.router"));
const announcement_router_1 = __importDefault(require("./routers/announcement.router"));
const news_router_1 = __importDefault(require("./routers/news.router"));
const book_router_1 = __importDefault(require("./routers/book.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const conflict_router_1 = __importDefault(require("./routers/conflict.router"));
dotenv_1.default.config();
database_1.default.initialize()
    .then(async () => {
    console.log("Data Source has been initialized!");
    await (0, database_1.seedInitialData)();
})
    .catch((error) => console.error("Error during Data Source initialization", error));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    limit: "50mb",
    extended: true,
}));
app.use((0, cors_1.default)({}));
// Referrer-Policy header ekleme
app.use((req, res, next) => {
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
});
app.use("/auth", auth_router_1.default);
app.use("/page", page_router_1.default);
app.use("/news", news_router_1.default);
app.use("/books", book_router_1.default);
app.use("/announcement", announcement_router_1.default);
app.use("/conflict", conflict_router_1.default);
app.use("/role", role_router_1.default);
app.use("/search", search_router_1.default);
app.use("/gallery", gallery_router_1.default);
app.use("/user", user_router_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
