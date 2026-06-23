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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const ratings_service_1 = require("./ratings.service");
const submit_rating_dto_1 = require("./dto/submit-rating.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let RatingsController = class RatingsController {
    ratingsService;
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    async submitRating(req, submitRatingDto) {
        return this.ratingsService.submitRating(req.user.id, submitRatingDto);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.NORMAL),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_rating_dto_1.SubmitRatingDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "submitRating", null);
exports.RatingsController = RatingsController = __decorate([
    (0, common_1.Controller)('ratings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map