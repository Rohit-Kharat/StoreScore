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
exports.CreateStoreDto = void 0;
const class_validator_1 = require("class-validator");
class CreateStoreDto {
    name;
    email;
    address;
    ownerId;
}
exports.CreateStoreDto = CreateStoreDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store Name is required.' }),
    (0, class_validator_1.Length)(20, 60, { message: 'Store Name must be between 20 and 60 characters.' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store Email is required.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Must follow standard email validation rules.' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store Address is required.' }),
    (0, class_validator_1.MaxLength)(400, { message: 'Store Address must be maximum 400 characters.' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Owner ID must be an integer.' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "ownerId", void 0);
//# sourceMappingURL=create-store.dto.js.map