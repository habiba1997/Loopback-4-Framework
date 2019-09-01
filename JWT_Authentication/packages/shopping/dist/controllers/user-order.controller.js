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
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
/**
 * Controller for User's Orders
 */
let UserOrderController = class UserOrderController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    /**
     * Create or update the orders for a given user
     * @param userId User id
     * @param cart Shopping cart
     */
    async createOrder(userId, order) {
        if (userId !== order.userId) {
            throw new rest_1.HttpErrors.BadRequest(`User id does not match: ${userId} !== ${order.userId}`);
        }
        delete order.userId;
        return await this.userRepo.orders(userId).create(order);
    }
    async findOrders(userId, filter) {
        const orders = await this.userRepo.orders(userId).find(filter);
        return orders;
    }
    async patchOrders(userId, order, where) {
        return await this.userRepo.orders(userId).patch(order, where);
    }
    async deleteOrders(userId, where) {
        return await this.userRepo.orders(userId).delete(where);
    }
};
__decorate([
    rest_1.post('/users/{userId}/orders', {
        responses: {
            '200': {
                description: 'User.Order model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Order } } },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, models_1.Order]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "createOrder", null);
__decorate([
    rest_1.get('/users/{userId}/orders', {
        responses: {
            '200': {
                description: "Array of User's Orders",
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Order } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.param.query.string('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "findOrders", null);
__decorate([
    rest_1.patch('/users/{userId}/orders', {
        responses: {
            '200': {
                description: 'User.Order PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.requestBody()),
    __param(2, rest_1.param.query.string('where')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "patchOrders", null);
__decorate([
    rest_1.del('/users/{userId}/orders', {
        responses: {
            '200': {
                description: 'User.Order DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.path.string('userId')),
    __param(1, rest_1.param.query.string('where')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "deleteOrders", null);
UserOrderController = __decorate([
    __param(0, repository_1.repository(repositories_1.UserRepository)),
    __metadata("design:paramtypes", [repositories_1.UserRepository])
], UserOrderController);
exports.UserOrderController = UserOrderController;
//# sourceMappingURL=user-order.controller.js.map