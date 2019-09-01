"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const repositories_1 = require("../../repositories");
const datasources_1 = require("../../datasources");
const helper_1 = require("./helper");
const loopback4_example_recommender_1 = require("loopback4-example-recommender");
const keys_1 = require("../../keys");
const jwt_service_1 = require("../../services/jwt-service");
const recommendations = require('loopback4-example-recommender/data/recommendations.json');
describe('UserController', () => {
    let app;
    let client;
    const mongodbDS = new datasources_1.MongoDataSource();
    const orderRepo = new repositories_1.OrderRepository(mongodbDS);
    const userRepo = new repositories_1.UserRepository(mongodbDS, orderRepo);
    const user = {
        email: 'test@loopback.io',
        password: 'p4ssw0rd',
        firstName: 'Example',
        lastName: 'User',
    };
    let passwordHasher;
    let expiredToken;
    before('setupApplication', async () => {
        ({ app, client } = await helper_1.setupApplication());
    });
    before(migrateSchema);
    before(createPasswordHasher);
    before(givenAnExpiredToken);
    beforeEach(clearDatabase);
    after(async () => {
        await app.stop();
    });
    it('creates new user when POST /users is invoked', async () => {
        const res = await client
            .post('/users')
            .send(user)
            .expect(200);
        // Assertions
        testlab_1.expect(res.body.email).to.equal('test@loopback.io');
        testlab_1.expect(res.body.firstName).to.equal('Example');
        testlab_1.expect(res.body.lastName).to.equal('User');
        testlab_1.expect(res.body).to.have.property('id');
        testlab_1.expect(res.body).to.not.have.property('password');
    });
    it('throws error for POST /users with a missing email', async () => {
        const res = await client
            .post('/users')
            .send({
            password: 'p4ssw0rd',
            firstName: 'Example',
            lastName: 'User',
        })
            .expect(422);
        const errorText = JSON.parse(res.error.text);
        testlab_1.expect(errorText.error.details[0].info.missingProperty).to.equal('email');
    });
    it('throws error for POST /users with an invalid email', async () => {
        const res = await client
            .post('/users')
            .send({
            email: 'test@loop&back.io',
            password: 'p4ssw0rd',
            firstName: 'Example',
            lastName: 'User',
        })
            .expect(422);
        testlab_1.expect(res.body.error.message).to.equal('invalid email');
    });
    it('throws error for POST /users with a missing password', async () => {
        const res = await client
            .post('/users')
            .send({
            email: 'test@loopback.io',
            firstName: 'Example',
            lastName: 'User',
        })
            .expect(422);
        const errorText = JSON.parse(res.error.text);
        testlab_1.expect(errorText.error.details[0].info.missingProperty).to.equal('password');
    });
    it('throws error for POST /users with a string', async () => {
        const res = await client
            .post('/users')
            .send('hello')
            .expect(415);
        testlab_1.expect(res.body.error.message).to.equal('Content-type application/x-www-form-urlencoded does not match [application/json].');
    });
    it('throws error for POST /users with an existing email', async () => {
        await client
            .post('/users')
            .send(user)
            .expect(200);
        const res = await client
            .post('/users')
            .send(user)
            .expect(409);
        testlab_1.expect(res.body.error.message).to.equal('Email value is already taken');
    });
    it('returns a user with given id when GET /users/{id} is invoked', async () => {
        const newUser = await createAUser();
        delete newUser.password;
        delete newUser.orders;
        await client.get(`/users/${newUser.id}`).expect(200, newUser.toJSON());
    });
    describe('authentication', () => {
        it('login returns a JWT token', async () => {
            const newUser = await createAUser();
            const res = await client
                .post('/users/login')
                .send({ email: newUser.email, password: user.password })
                .expect(200);
            const token = res.body.token;
            testlab_1.expect(token).to.not.be.empty();
        });
        it('login returns an error when invalid email is used', async () => {
            await createAUser();
            const res = await client
                .post('/users/login')
                .send({ email: 'idontexist@example.com', password: user.password })
                .expect(401);
            testlab_1.expect(res.body.error.message).to.equal('Invalid email or password.');
        });
        it('login returns an error when invalid password is used', async () => {
            const newUser = await createAUser();
            const res = await client
                .post('/users/login')
                .send({ email: newUser.email, password: 'wrongpassword' })
                .expect(401);
            testlab_1.expect(res.body.error.message).to.equal('Invalid email or password.');
        });
        it('users/me returns the current user profile when a valid JWT token is provided', async () => {
            const newUser = await createAUser();
            let res = await client
                .post('/users/login')
                .send({ email: newUser.email, password: user.password })
                .expect(200);
            const token = res.body.token;
            res = await client
                .get('/users/me')
                .set('Authorization', 'Bearer ' + token)
                .expect(200);
            const userProfile = res.body;
            testlab_1.expect(userProfile.id).to.equal(newUser.id);
            testlab_1.expect(userProfile.name).to.equal(`${newUser.firstName} ${newUser.lastName}`);
        });
        it('users/me returns an error when a JWT token is not provided', async () => {
            const res = await client.get('/users/me').expect(401);
            testlab_1.expect(res.body.error.message).to.equal('Authorization header not found.');
        });
        it('users/me returns an error when an invalid JWT token is provided', async () => {
            const res = await client
                .get('/users/me')
                .set('Authorization', 'Bearer ' + 'xxx.yyy.zzz')
                .expect(401);
            testlab_1.expect(res.body.error.message).to.equal('Error verifying token : invalid token');
        });
        it(`users/me returns an error when 'Bearer ' is not found in Authorization header`, async () => {
            const res = await client
                .get('/users/me')
                .set('Authorization', 'NotB3@r3r ' + 'xxx.yyy.zzz')
                .expect(401);
            testlab_1.expect(res.body.error.message).to.equal("Authorization header is not of type 'Bearer'.");
        });
        it('users/me returns an error when an expired JWT token is provided', async () => {
            const res = await client
                .get('/users/me')
                .set('Authorization', 'Bearer ' + expiredToken)
                .expect(401);
            testlab_1.expect(res.body.error.message).to.equal('Error verifying token : jwt expired');
        });
    });
    describe('user product recommendation (service) api', () => {
        let recommendationService;
        before(async () => {
            recommendationService = loopback4_example_recommender_1.createRecommendationServer();
            await recommendationService.start();
        });
        after(async () => {
            await recommendationService.stop();
        });
        it('returns product recommendations for a user', async () => {
            const newUser = await createAUser();
            await client
                .get(`/users/${newUser.id}/recommend`)
                .expect(200, recommendations);
        });
    });
    async function clearDatabase() {
        await userRepo.deleteAll();
    }
    async function migrateSchema() {
        await app.migrateSchema();
    }
    async function createAUser() {
        const encryptedPassword = await passwordHasher.hashPassword(user.password);
        const newUser = await userRepo.create(Object.assign({}, user, { password: encryptedPassword }));
        // MongoDB returns an id object we need to convert to string
        newUser.id = newUser.id.toString();
        return newUser;
    }
    async function createPasswordHasher() {
        passwordHasher = await app.get(keys_1.PasswordHasherBindings.PASSWORD_HASHER);
    }
    /**
     * Creates an expired token
     *
     * Specifying a negative value for 'expiresIn' so the
     * token is automatically expired
     */
    async function givenAnExpiredToken() {
        const newUser = await createAUser();
        const tokenService = new jwt_service_1.JWTService(keys_1.TokenServiceConstants.TOKEN_SECRET_VALUE, '-1');
        const userProfile = {
            id: newUser.id,
            name: `${newUser.firstName} ${newUser.lastName}`,
        };
        expiredToken = await tokenService.generateToken(userProfile);
    }
});
//# sourceMappingURL=user.controller.acceptance.js.map