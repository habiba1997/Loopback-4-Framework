import { Filter, Where, Count } from '@loopback/repository';
import { UserRepository } from '../repositories';
import { Order } from '../models';
/**
 * Controller for User's Orders
 */
export declare class UserOrderController {
    protected userRepo: UserRepository;
    constructor(userRepo: UserRepository);
    /**
     * Create or update the orders for a given user
     * @param userId User id
     * @param cart Shopping cart
     */
    createOrder(userId: string, order: Order): Promise<Order>;
    findOrders(userId: string, filter?: Filter<Order>): Promise<Order[]>;
    patchOrders(userId: string, order: Partial<Order>, where?: Where<Order>): Promise<Count>;
    deleteOrders(userId: string, where?: Where<Order>): Promise<Count>;
}
