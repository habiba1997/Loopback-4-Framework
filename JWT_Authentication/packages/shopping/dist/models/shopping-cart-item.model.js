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
/**
 * Item in a shopping cart
 */
let ShoppingCartItem = class ShoppingCartItem extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.property({ id: true }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "productId", void 0);
__decorate([
    repository_1.property(),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "quantity", void 0);
__decorate([
    repository_1.property(),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "price", void 0);
ShoppingCartItem = __decorate([
    repository_1.model(),
    __metadata("design:paramtypes", [Object])
], ShoppingCartItem);
exports.ShoppingCartItem = ShoppingCartItem;
//# sourceMappingURL=shopping-cart-item.model.js.map