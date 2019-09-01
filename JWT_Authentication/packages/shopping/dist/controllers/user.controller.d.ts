import { User, Product } from '../models';
import { UserRepository } from '../repositories';
import { RecommenderService } from '../services/recommender.service';
import { UserProfile, TokenService, UserService } from '@loopback/authentication';
import { Credentials } from '../repositories/user.repository';
import { PasswordHasher } from '../services/hash.password.bcryptjs';
export declare class UserController {
    userRepository: UserRepository;
    recommender: RecommenderService;
    passwordHasher: PasswordHasher;
    jwtService: TokenService;
    userService: UserService<User, Credentials>;
    constructor(userRepository: UserRepository, recommender: RecommenderService, passwordHasher: PasswordHasher, jwtService: TokenService, userService: UserService<User, Credentials>);
    create(user: User): Promise<User>;
    findById(userId: string): Promise<User>;
    printCurrentUser(currentUserProfile: UserProfile): Promise<UserProfile>;
    productRecommendations(userId: string): Promise<Product[]>;
    login(credentials: Credentials): Promise<{
        token: string;
    }>;
}
