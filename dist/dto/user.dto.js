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
exports.CreateDeliveryUserInputs = exports.OrderInputs = exports.CartItem = exports.EditUserProfileInputs = exports.UserLoginInputs = exports.CreateUserInputs = void 0;
const class_validator_1 = require("class-validator");
class CreateUserInputs {
}
exports.CreateUserInputs = CreateUserInputs;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 13),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "password", void 0);
class UserLoginInputs {
}
exports.UserLoginInputs = UserLoginInputs;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserLoginInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], UserLoginInputs.prototype, "password", void 0);
class EditUserProfileInputs {
}
exports.EditUserProfileInputs = EditUserProfileInputs;
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], EditUserProfileInputs.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], EditUserProfileInputs.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 20),
    __metadata("design:type", String)
], EditUserProfileInputs.prototype, "address", void 0);
class CartItem {
}
exports.CartItem = CartItem;
class OrderInputs {
}
exports.OrderInputs = OrderInputs;
class CreateDeliveryUserInputs {
}
exports.CreateDeliveryUserInputs = CreateDeliveryUserInputs;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 13),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 24),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.Length)(4, 12),
    __metadata("design:type", String)
], CreateDeliveryUserInputs.prototype, "pincode", void 0);
//# sourceMappingURL=user.dto.js.map