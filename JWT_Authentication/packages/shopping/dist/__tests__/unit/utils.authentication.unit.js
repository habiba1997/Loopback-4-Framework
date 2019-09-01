"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const validator_1 = require("../../services/validator");
const datasources_1 = require("../../datasources");
const repositories_1 = require("../../repositories");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../../keys");
const helper_1 = require("./helper");
describe('authentication services', () => {
    let app;
    const mongodbDS = new datasources_1.MongoDataSource();
    const orderRepo = new repositories_1.OrderRepository(mongodbDS);
    const userRepo = new repositories_1.UserRepository(mongodbDS, orderRepo);
    const user = {
        email: 'unittest@loopback.io',
        password: 'p4ssw0rd',
        firstName: 'unit',
        lastName: 'test',
    };
    let newUser;
    let jwtService;
    let userService;
    let bcryptHasher;
    before(setupApp);
    before(clearDatabase);
    before(createUser);
    before(createTokenService);
    before(createUserService);
    it('validateCredentials() succeeds', () => {
        const credentials = { email: 'dom@example.com', password: 'p4ssw0rd' };
        testlab_1.expect(() => validator_1.validateCredentials(credentials)).to.not.throw();
    });
    it('validateCredentials() fails with invalid email', () => {
        const expectedError = new rest_1.HttpErrors.UnprocessableEntity('invalid email');
        const credentials = { email: 'domdomdom', password: 'p4ssw0rd' };
        testlab_1.expect(() => validator_1.validateCredentials(credentials)).to.throw(expectedError);
    });
    it('validateCredentials() fails with invalid password', () => {
        const expectedError = new rest_1.HttpErrors.UnprocessableEntity('password must be minimum 8 characters');
        const credentials = { email: 'dom@example.com', password: 'p4ss' };
        testlab_1.expect(() => validator_1.validateCredentials(credentials)).to.throw(expectedError);
    });
    it('user service verifyCredentials() succeeds', async () => {
        const { email } = newUser;
        const credentials = { email, password: user.password };
        const returnedUser = await userService.verifyCredentials(credentials);
        // create a copy of returned user without password field
        const returnedUserWithOutPassword = Object.assign({}, returnedUser, {
            password: user.password,
        });
        delete returnedUserWithOutPassword.password;
        // create a copy of expected user without password field
        const expectedUserWithoutPassword = Object.assign({}, newUser);
        delete expectedUserWithoutPassword.password;
        testlab_1.expect(returnedUserWithOutPassword).to.deepEqual(expectedUserWithoutPassword);
    });
    it('user service verifyCredentials() fails with user not found', async () => {
        const credentials = { email: 'idontexist@example.com', password: 'p4ssw0rd' };
        const expectedError = new rest_1.HttpErrors.Unauthorized('Invalid email or password.');
        await testlab_1.expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(expectedError);
    });
    it('user service verifyCredentials() fails with incorrect credentials', async () => {
        const { email } = newUser;
        const credentials = { email, password: 'invalidp4ssw0rd' };
        const expectedError = new rest_1.HttpErrors.Unauthorized('Invalid email or password.');
        await testlab_1.expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(expectedError);
    });
    it('user service convertToUserProfile() succeeds', () => {
        const expectedUserProfile = {
            id: newUser.id,
            name: `${newUser.firstName} ${newUser.lastName}`,
        };
        const userProfile = userService.convertToUserProfile(newUser);
        testlab_1.expect(expectedUserProfile).to.deepEqual(userProfile);
    });
    it('user service convertToUserProfile() succeeds without optional fields : firstName, lastName', () => {
        const userWithoutFirstOrLastName = Object.assign({}, newUser);
        delete userWithoutFirstOrLastName.firstName;
        delete userWithoutFirstOrLastName.lastName;
        const userProfile = userService.convertToUserProfile(userWithoutFirstOrLastName);
        testlab_1.expect(userProfile.id).to.equal(newUser.id);
        testlab_1.expect(userProfile.name).to.equal('');
    });
    it('user service convertToUserProfile() succeeds without optional field : lastName', () => {
        const userWithoutLastName = Object.assign({}, newUser);
        delete userWithoutLastName.lastName;
        const userProfile = userService.convertToUserProfile(userWithoutLastName);
        testlab_1.expect(userProfile.id).to.equal(newUser.id);
        testlab_1.expect(userProfile.name).to.equal(newUser.firstName);
    });
    it('user service convertToUserProfile() succeeds without optional field : firstName', () => {
        const userWithoutFirstName = Object.assign({}, newUser);
        delete userWithoutFirstName.firstName;
        const userProfile = userService.convertToUserProfile(userWithoutFirstName);
        testlab_1.expect(userProfile.id).to.equal(newUser.id);
        testlab_1.expect(userProfile.name).to.equal(newUser.lastName);
    });
    it('token service generateToken() succeeds', async () => {
        const userProfile = userService.convertToUserProfile(newUser);
        const token = await jwtService.generateToken(userProfile);
        testlab_1.expect(token).to.not.be.empty();
    });
    it('token service verifyToken() succeeds', async () => {
        const userProfile = userService.convertToUserProfile(newUser);
        const token = await jwtService.generateToken(userProfile);
        const userProfileFromToken = await jwtService.verifyToken(token);
        testlab_1.expect(userProfileFromToken).to.deepEqual(userProfile);
    });
    it('token service verifyToken() fails', async () => {
        const expectedError = new rest_1.HttpErrors.Unauthorized(`Error verifying token : invalid token`);
        const invalidToken = 'aaa.bbb.ccc';
        await testlab_1.expect(jwtService.verifyToken(invalidToken)).to.be.rejectedWith(expectedError);
    });
    it('password encrypter hashPassword() succeeds', async () => {
        const encrypedPassword = await bcryptHasher.hashPassword(user.password);
        testlab_1.expect(encrypedPassword).to.not.equal(user.password);
    });
    it('password encrypter compare() succeeds', async () => {
        const encrypedPassword = await bcryptHasher.hashPassword(user.password);
        const passwordsAreTheSame = await bcryptHasher.comparePassword(user.password, encrypedPassword);
        testlab_1.expect(passwordsAreTheSame).to.be.True();
    });
    it('password encrypter compare() fails', async () => {
        const encrypedPassword = await bcryptHasher.hashPassword(user.password);
        const passwordsAreTheSame = await bcryptHasher.comparePassword('someotherpassword', encrypedPassword);
        testlab_1.expect(passwordsAreTheSame).to.be.False();
    });
    async function setupApp() {
        app = await helper_1.setupApplication();
        app.bind(keys_1.PasswordHasherBindings.ROUNDS).to(4);
    }
    async function createUser() {
        bcryptHasher = await app.get(keys_1.PasswordHasherBindings.PASSWORD_HASHER);
        const encryptedPassword = await bcryptHasher.hashPassword(user.password);
        newUser = await userRepo.create(Object.assign({}, user, { password: encryptedPassword }));
        // MongoDB returns an id object we need to convert to string
        newUser.id = newUser.id.toString();
    }
    async function clearDatabase() {
        await userRepo.deleteAll();
    }
    async function createTokenService() {
        jwtService = await app.get(keys_1.TokenServiceBindings.TOKEN_SERVICE);
    }
    async function createUserService() {
        userService = await app.get(keys_1.UserServiceBindings.USER_SERVICE);
    }
});
//# sourceMappingURL=utils.authentication.unit.js.map