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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const rating_entity_1 = require("../../ratings/entities/rating.entity");
let Store = class Store {
    id;
    name;
    email;
    address;
    ownerId;
    owner;
    createdAt;
    updatedAt;
    ratings;
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Store.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Store.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 400 }),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.store, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", Object)
], Store.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rating_entity_1.Rating, (rating) => rating.store),
    __metadata("design:type", Array)
], Store.prototype, "ratings", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)('stores')
], Store);
//# sourceMappingURL=store.entity.js.map