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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../entities/user.entity");
class CreateUserDto {
    name;
    email;
    address;
    password;
    role;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.Length)(20, 60, { message: 'Name must be between 20 and 60 characters.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Must follow standard email validation rules.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Address is required' }),
    (0, class_validator_1.MaxLength)(400, { message: 'Address must be maximum 400 characters.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.Length)(8, 16, { message: 'Password must be between 8 and 16 characters.' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'Password must include at least one uppercase letter and one special character.',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Role is required' }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserRole, { message: 'Role must be admin, normal, or owner.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
//# sourceMappingURL=create-user.dto.js.map