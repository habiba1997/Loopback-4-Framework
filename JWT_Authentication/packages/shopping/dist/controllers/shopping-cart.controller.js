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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@loopback/rest");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
const models_1 = require("../models");
const debugFactory = require("debug");
const debug = debugFactory('loopback:example:shopping');
/**
 * Controller for shopping cart
 */
let ShoppingCartController = class ShoppingCartController {
    constructor(shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }
    /**
     * Create or update the shopping cart for a given user
     * @param userId User id
     * @param cart Shopping cart
     */
    async set(userId, cart) {
        debug('Create shopping cart %s: %j', userId, cart);
        if (userId !== cart.userId) {
            throw new rest_1.HttpErrors.BadRequest(`User id does not match: ${userId} !== ${cart.userId}`);
        }
        await this.shoppingCartRepository.set(userId, cart);
    }
    /**
     * Retrieve the shopping cart by user id
     * @param userId User id
     */
    async get(userId) {
        debug('Get shopping cart %s', userId);
        const cart = await this.shoppingCartRepository.get(userId);
        debug('Shopping cart %s: %j', userId, cart);
        if (cart == null) {
            throw new rest_1.HttpErrors.NotFound(`Shopping cart not found for user: ${userId}`);
        }
        else {
            return cart;
        }
    }
    /**
     * Delete the shopping cart by user id
     * @param userId User id
     */
    async remove(userId) {
        debug('Remove shopping cart %s', userId);
        await this.shoppingCartRepository.delete(userId);
    }
    /**
     * Add an item to the shopping cart for a given user
     * @param userId User id
     * @param cart Shopping cart item to be added
     */
    async addItem(userId, item) {
        debug('Add item %j to shopping cart %s', item, userId);
        return this.shoppingCartRepository.addItem(userId, item);
    }
};
__decorate([
    rest_1.put('/shoppingCarts/{userId}', {
        responses: {
            '204': {
                description: 'User shopping cart is created or updated',
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.requestBody({ description: 'shopping cart' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, models_1.ShoppingCart]),
    __metadata("design:returntype", Promise)
], ShoppingCartController.prototype, "set", null);
__decorate([
    rest_1.get('/shoppingCarts/{userId}', {
        responses: {
            '200': {
                description: 'User shopping cart is read',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.ShoppingCart } } },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShoppingCartController.prototype, "get", null);
__decorate([
    rest_1.del('/shoppingCarts/{userId}', {
        responses: {
            '204': {
                description: 'User shopping cart is deleted',
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShoppingCartController.prototype, "remove", null);
__decorate([
    rest_1.post('/shoppingCarts/{userId}/items', {
        responses: {
            '200': {
                description: 'User shopping cart item is created',
                content: {
                    'application/json': { schema: { 'x-ts-type': models_1.ShoppingCart } },
                },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.requestBody({ description: 'shopping cart item' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, models_1.ShoppingCartItem]),
    __metadata("design:returntype", Promise)
], ShoppingCartController.prototype, "addItem", null);
ShoppingCartController = __decorate([
    __param(0, repository_1.repository(repositories_1.ShoppingCartRepository)),
    __metadata("design:paramtypes", [repositories_1.ShoppingCartRepository])
], ShoppingCartController);
exports.ShoppingCartController = ShoppingCartController;
//# sourceMappingURL=shopping-cart.controller.js.map