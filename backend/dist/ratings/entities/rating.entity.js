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
exports.Rating = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
let Rating = class Rating {
    id;
    score;
    userId;
    storeId;
    user;
    store;
    createdAt;
    updatedAt;
};
exports.Rating = Rating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Rating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Rating.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Rating.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Rating.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ratings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Rating.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.ratings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'storeId' }),
    __metadata("design:type", store_entity_1.Store)
], Rating.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Rating.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Rating.prototype, "updatedAt", void 0);
exports.Rating = Rating = __decorate([
    (0, typeorm_1.Entity)('ratings'),
    (0, typeorm_1.Unique)(['userId', 'storeId'])
], Rating);
//# sourceMappingURL=rating.entity.js.map