import { Entity } from '@loopback/repository';
import { Order } from './order.model';
export declare class User extends Entity {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    orders: Order[];
    constructor(data?: Partial<User>);
}
