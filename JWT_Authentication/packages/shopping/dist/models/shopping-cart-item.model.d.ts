import { Entity } from '@loopback/repository';
/**
 * Item in a shopping cart
 */
export declare class ShoppingCartItem extends Entity {
    /**
     * Product id
     */
    productId: string;
    /**
     * Quantity
     */
    quantity: number;
    /**
     * Price
     */
    price?: number;
    constructor(data?: Partial<ShoppingCartItem>);
}
