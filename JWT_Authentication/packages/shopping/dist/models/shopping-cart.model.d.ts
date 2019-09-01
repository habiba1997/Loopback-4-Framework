import { Entity } from '@loopback/repository';
import { ShoppingCartItem } from './shopping-cart-item.model';
export declare class ShoppingCart extends Entity {
    /**
     * Each shopping cart belongs to a user, indentified by its id (userId)
     */
    userId: string;
    /**
     * Items in the shopping cart
     */
    items?: ShoppingCartItem[];
    constructor(data?: Partial<ShoppingCart>);
}
