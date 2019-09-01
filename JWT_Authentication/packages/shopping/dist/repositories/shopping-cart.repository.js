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
const models_1 = require("../models");
const redis_datasource_1 = require("../datasources/redis.datasource");
const context_1 = require("@loopback/context");
const util_1 = require("util");
const retry_1 = require("../utils/retry");
let ShoppingCartRepository = class ShoppingCartRepository extends repository_1.DefaultKeyValueRepository {
    constructor(ds) {
        super(models_1.ShoppingCart, ds);
    }
    /**
     * Add an item to the shopping cart with optimistic lock to allow concurrent
     * `adding to cart` from multiple devices. If race condition happens, it will
     * try 10 times at an interval of 10 ms. Timeout will be reported as an error.
     *
     * @param userId User id
     * @param item Item to be added
     * @returns A promise that's resolved with the updated ShoppingCart instance
     *
     */
    addItem(userId, item) {
        const task = {
            run: async () => {
                const addItemToCart = (cart) => {
                    cart = cart || new models_1.ShoppingCart({ userId });
                    cart.items = cart.items || [];
                    cart.items.push(item);
                    return cart;
                };
                const result = await this.checkAndSet(userId, addItemToCart);
                return {
                    done: result != null,
                    value: result,
                };
            },
            description: `update the shopping cart for '${userId}'`,
        };
        return retry_1.retry(task, { maxTries: 10, interval: 10 });
    }
    /**
     * Use Redis WATCH and Transaction to check and set against a key
     * See https://redis.io/topics/transactions#optimistic-locking-using-check-and-set
     *
     * Ideally, this method should be made available by `KeyValueRepository`.
     *
     * @param userId User id
     * @param check A function that checks the current value and produces a new
     * value. It returns `null` to abort.
     *
     * @returns A promise that's resolved with the updated ShoppingCart instance
     * or with null if the transaction failed due to a race condition.
     * See https://github.com/NodeRedis/node_redis#optimistic-locks
     */
    async checkAndSet(userId, check) {
        const connector = this.kvModelClass.dataSource.connector;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const execute = util_1.promisify((cmd, args, cb) => {
            return connector.execute(cmd, args, cb);
        });
        /**
         * - WATCH userId
         * - GET userId
         * - check(cart)
         * - MULTI
         * - SET userId
         * - EXEC
         */
        await execute('WATCH', [userId]);
        let cart = await this.get(userId);
        cart = check(cart);
        if (!cart)
            return null;
        await execute('MULTI', []);
        await this.set(userId, cart);
        const result = await execute('EXEC', []);
        return result == null ? null : cart;
    }
};
ShoppingCartRepository = __decorate([
    __param(0, context_1.inject('datasources.redis')),
    __metadata("design:paramtypes", [redis_datasource_1.RedisDataSource])
], ShoppingCartRepository);
exports.ShoppingCartRepository = ShoppingCartRepository;
//# sourceMappingURL=shopping-cart.repository.js.map