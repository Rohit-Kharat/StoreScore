"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ratings_service_1 = require("./ratings.service");
const ratings_controller_1 = require("./ratings.controller");
const rating_entity_1 = require("./entities/rating.entity");
const stores_module_1 = require("../stores/stores.module");
let RatingsModule = class RatingsModule {
};
exports.RatingsModule = RatingsModule;
exports.RatingsModule = RatingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([rating_entity_1.Rating]), stores_module_1.StoresModule],
        controllers: [ratings_controller_1.RatingsController],
        providers: [ratings_service_1.RatingsService],
        exports: [ratings_service_1.RatingsService, typeorm_1.TypeOrmModule],
    })
], RatingsModule);
//# sourceMappingURL=ratings.module.js.map