import { Entity } from '@loopback/repository';
export declare class Product extends Entity {
    productId: string;
    name: string;
    price: number;
    constructor(data?: Partial<Product>);
}
