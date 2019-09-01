"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const repositories_1 = require("../../repositories");
const datasources_1 = require("../../datasources");
const models_1 = require("../../models");
const helper_1 = require("./helper");
describe('ShoppingCartController', () => {
    let app;
    let client;
    const cartRepo = new repositories_1.ShoppingCartRepository(new datasources_1.RedisDataSource());
    before('setupApplication', async () => {
        ({ app, client } = await helper_1.setupApplication());
    });
    after(async () => {
        await app.stop();
    });
    beforeEach(clearDatabase);
    it('sets a shopping cart for a user', async () => {
        const cart = givenShoppingCart();
        await client
            .put(`/shoppingCarts/${cart.userId}`)
            .set('Content-Type', 'application/json')
            .send(cart)
            .expect(204);
    });
    it('throws error if userId does not match the cart', async () => {
        const cart = givenShoppingCart();
        await client
            .put('/shoppingCarts/non-existant-id')
            .set('Content-Type', 'application/json')
            .send(cart)
            .expect(400);
    });
    it('returns a shopping cart', async () => {
        const cart = givenShoppingCart();
        await client.get(`/shoppingCarts/${cart.userId}`).expect(404);
        await client
            .put(`/shoppingCarts/${cart.userId}`)
            .send(cart)
            .expect(204);
        await client
            .get(`/shoppingCarts/${cart.userId}`)
            .expect(200, cart.toJSON());
    });
    it('deletes a shopping cart', async () => {
        const cart = givenShoppingCart();
        // Set the shopping cart
        await client
            .put(`/shoppingCarts/${cart.userId}`)
            .send(cart)
            .expect(204);
        // Now we can see it
        await client
            .get(`/shoppingCarts/${cart.userId}`)
            .expect(200, cart.toJSON());
        // Delete the shopping cart
        await client.del(`/shoppingCarts/${cart.userId}`).expect(204);
        // Now it's gone
        await client.get(`/shoppingCarts/${cart.userId}`).expect(404);
    });
    it('adds a shopping cart item', async () => {
        const cart = givenShoppingCart();
        const newItem = givenAnItem();
        // Set the shopping cart
        await client
            .put(`/shoppingCarts/${cart.userId}`)
            .send(cart)
            .expect(204);
        // Now we can see it
        await client
            .post(`/shoppingCarts/${cart.userId}/items`)
            .send(newItem)
            .expect(200);
        const newCart = (await client
            .get(`/shoppingCarts/${cart.userId}`)
            .expect(200)).body;
        testlab_1.expect(newCart.items).to.containEql(newItem.toJSON());
    });
    async function clearDatabase() {
        await cartRepo.deleteAll();
    }
    function givenAnItem(item) {
        return new models_1.ShoppingCartItem(Object.assign({
            productId: 'iPhone XS',
            quantity: 2,
            price: 2000,
        }, item));
    }
    function givenShoppingCart() {
        return new models_1.ShoppingCart({
            userId: 'user-0001',
            items: [givenAnItem()],
        });
    }
});
//# sourceMappingURL=shopping-cart.controller.acceptance.js.map