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
const token_entity_1 = __importDefault(require("../database/token.entity"));
const role_entity_1 = __importDefault(require("../database/role.entity"));
const announcement_entity_1 = __importDefault(require("../database/announcement.entity"));
const book_entity_1 = __importDefault(require("../database/book.entity"));
const conflict_entity_1 = __importDefault(require("../database/conflict.entity"));
const new_entity_1 = __importDefault(require("../database/new.entity"));
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longblob", nullable: true, default: null, select: false }),
    __metadata("design:type", Buffer)
], User.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], User.prototype, "biography", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", unique: true, select: false, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", select: false, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_entity_1.default, token => token.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.default, role => role.users, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "roleId" }),
    __metadata("design:type", role_entity_1.default)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4, select: false }),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => announcement_entity_1.default, announcement => announcement.user),
    __metadata("design:type", Array)
], User.prototype, "announcements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => book_entity_1.default, book => book.user),
    __metadata("design:type", Array)
], User.prototype, "books", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conflict_entity_1.default, conflict => conflict.user),
    __metadata("design:type", Array)
], User.prototype, "conflicts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => new_entity_1.default, news => news.user),
    __metadata("design:type", Array)
], User.prototype, "news", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.default = User;
