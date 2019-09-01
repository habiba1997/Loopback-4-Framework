"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const helper_1 = require("./helper");
describe('HomePageController', () => {
    let app;
    let client;
    before('setupApplication', async () => {
        ({ app, client } = await helper_1.setupApplication());
    });
    after(async () => {
        await app.stop();
    });
    it('exposes a default home page', async () => {
        const res = await client
            .get('/')
            .expect(200)
            .expect('Content-Type', /text\/html/);
        testlab_1.expect(res.body).to.match(/@loopback\/example\-shopping/);
    });
});
//# sourceMappingURL=home-page.acceptance.js.map