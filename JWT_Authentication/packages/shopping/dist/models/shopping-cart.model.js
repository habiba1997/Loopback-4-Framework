"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
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
const repository_1 = require("@loopback/repository");
const shopping_cart_item_model_1 = require("./shopping-cart-item.model");
const user_model_1 = require("./user.model");
let ShoppingCart = class ShoppingCart extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    __metadata("design:type", String)
], ShoppingCart.prototype, "userId", void 0);
__decorate([
    repository_1.property.array(shopping_cart_item_model_1.ShoppingCartItem),
    __metadata("design:type", Array)
], ShoppingCart.prototype, "items", void 0);
ShoppingCart = __decorate([
    repository_1.model(),
    __metadata("design:paramtypes", [Object])
], ShoppingCart);
exports.ShoppingCart = ShoppingCart;
//# sourceMappingURL=shopping-cart.model.js.map