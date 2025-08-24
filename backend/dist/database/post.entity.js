"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = __importDefault(require("../database/user.entity"));
const category_entity_1 = __importDefault(require("../database/category.entity"));
let Post = class Post {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Post.prototype, "header", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longblob", nullable: true, select: false }),
    __metadata("design:type", Buffer)
], Post.prototype, "cover", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longtext", nullable: false }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.default, user => user.posts, { onDelete: "CASCADE", nullable: false }),
    __metadata("design:type", user_entity_1.default)
], Post.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.default, category => category.posts),
    __metadata("design:type", category_entity_1.default)
], Post.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
Post = __decorate([
    (0, typeorm_1.Entity)()
], Post);
exports.default = Post;
