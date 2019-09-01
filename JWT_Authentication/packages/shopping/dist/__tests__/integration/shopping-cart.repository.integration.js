"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../../repositories");
const models_1 = require("../../models");
const testlab_1 = require("@loopback/testlab");
const datasources_1 = require("../../datasources");
describe('ShoppingCart KeyValue Repository', () => {
    let repo;
    let cart1;
    let cart2;
    before(() => {
        cart1 = givenShoppingCart1();
        cart2 = givenShoppingCart2();
        repo = new repositories_1.ShoppingCartRepository(new datasources_1.RedisDataSource());
    });
    beforeEach(async () => {
        await repo.set(cart1.userId, cart1);
        await repo.set(cart2.userId, cart2);
    });
    afterEach(async () => {
        await repo.deleteAll();
    });
    it('gets data by key', async () => {
        let result = await repo.get(cart1.userId);
        testlab_1.expect(result.toJSON()).to.eql(cart1.toJSON());
        result = await repo.get(cart2.userId);
        testlab_1.expect(result.toJSON()).to.eql(cart2.toJSON());
    });
    it('list keys', async () => {
        var e_1, _a;
        const keys = [];
        try {
            for (var _b = __asyncValues(repo.keys()), _c; _c = await _b.next(), !_c.done;) {
                const k = _c.value;
                keys.push(k);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        testlab_1.expect(keys).to.containEql(cart1.userId);
        testlab_1.expect(keys).to.containEql(cart2.userId);
    });
    it('deletes a key', async () => {
        await repo.delete(cart1.userId);
        const result = await repo.get(cart1.userId);
        testlab_1.expect(result).to.be.null();
    });
    it('adds an item', async () => {
        const item = new models_1.ShoppingCartItem({
            productId: 'p3',
            quantity: 10,
            price: 200,
        });
        await repo.addItem(cart1.userId, item);
        const result = await repo.get(cart1.userId);
        testlab_1.expect(result.items).to.containEql(item.toJSON());
    });
});
function givenShoppingCart1() {
    return new models_1.ShoppingCart({
        userId: 'u01',
        items: [
            new models_1.ShoppingCartItem({
                productId: 'p1',
                quantity: 10,
                price: 100,
            }),
        ],
    });
}
function givenShoppingCart2() {
    return new models_1.ShoppingCart({
        userId: 'u02',
        items: [
            new models_1.ShoppingCartItem({
                productId: 'p1',
                quantity: 1,
                price: 10,
            }),
            new models_1.ShoppingCartItem({
                productId: 'p2',
                quantity: 5,
                price: 20,
            }),
        ],
    });
}
//# sourceMappingURL=shopping-cart.repository.integration.js.map