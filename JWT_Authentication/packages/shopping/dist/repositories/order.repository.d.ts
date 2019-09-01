import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Order } from '../models';
export declare class OrderRepository extends DefaultCrudRepository<Order, typeof Order.prototype.orderId> {
    protected datasource: juggler.DataSource;
    constructor(datasource: juggler.DataSource);
}
