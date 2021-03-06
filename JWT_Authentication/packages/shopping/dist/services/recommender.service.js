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
const service_proxy_1 = require("@loopback/service-proxy");
const core_1 = require("@loopback/core");
const recommender_datasource_1 = require("../datasources/recommender.datasource");
let RecommenderServiceProvider = class RecommenderServiceProvider {
    constructor(datasource) {
        this.datasource = datasource;
    }
    value() {
        return service_proxy_1.getService(this.datasource);
    }
};
RecommenderServiceProvider = __decorate([
    __param(0, core_1.inject('datasources.recommender')),
    __metadata("design:paramtypes", [recommender_datasource_1.RecommenderDataSource])
], RecommenderServiceProvider);
exports.RecommenderServiceProvider = RecommenderServiceProvider;
//# sourceMappingURL=recommender.service.js.map