"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const recommendations = require('../data/recommendations.json');
const http_server_1 = require("@loopback/http-server");
function createRecommendationServer(port = 3001, host = '127.0.0.1') {
    const app = express();
    app.get('/:userId', (req, res) => {
        res.send(recommendations);
    });
    return new http_server_1.HttpServer(app, { port, host });
}
exports.createRecommendationServer = createRecommendationServer;
async function main(port = 3001) {
    const server = createRecommendationServer(port);
    await server.start();
    console.log('Recommendation server is running at ' + server.url + '.');
    return server;
}
exports.main = main;
//# sourceMappingURL=mock-recommendation-app.js.map