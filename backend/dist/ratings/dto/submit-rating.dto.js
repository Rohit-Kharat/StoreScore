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
exports.SubmitRatingDto = void 0;
const class_validator_1 = require("class-validator");
class SubmitRatingDto {
    score;
    storeId;
}
exports.SubmitRatingDto = SubmitRatingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Rating value is required.' }),
    (0, class_validator_1.IsInt)({ message: 'Rating value must be an integer.' }),
    (0, class_validator_1.Min)(1, { message: 'Rating value must be at least 1.' }),
    (0, class_validator_1.Max)(5, { message: 'Rating value must be at most 5.' }),
    __metadata("design:type", Number)
], SubmitRatingDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store ID is required.' }),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be an integer.' }),
    __metadata("design:type", Number)
], SubmitRatingDto.prototype, "storeId", void 0);
//# sourceMappingURL=submit-rating.dto.js.map