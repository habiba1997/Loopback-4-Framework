import { Entity } from '@loopback/repository';
import { ShoppingCartItem } from './shopping-cart-item.model';
export declare class Order extends Entity {
    orderId?: string;
    userId: string;
    total?: number;
    products: ShoppingCartItem[];
    constructor(data?: Partial<Order>);
}
