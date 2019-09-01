import { DefaultCrudRepository, juggler, HasManyRepositoryFactory } from '@loopback/repository';
import { User, Order } from '../models';
import { OrderRepository } from './order.repository';
export declare type Credentials = {
    email: string;
    password: string;
};
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id> {
    protected datasource: juggler.DataSource;
    protected orderRepository: OrderRepository;
    orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;
    constructor(datasource: juggler.DataSource, orderRepository: OrderRepository);
}
