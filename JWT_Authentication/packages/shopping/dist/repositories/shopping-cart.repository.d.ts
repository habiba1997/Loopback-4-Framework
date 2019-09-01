import { DefaultKeyValueRepository } from '@loopback/repository';
import { ShoppingCart, ShoppingCartItem } from '../models';
import { RedisDataSource } from '../datasources/redis.datasource';
export declare class ShoppingCartRepository extends DefaultKeyValueRepository<ShoppingCart> {
    constructor(ds: RedisDataSource);
    /**
     * Add an item to the shopping cart with optimistic lock to allow concurrent
     * `adding to cart` from multiple devices. If race condition happens, it will
     * try 10 times at an interval of 10 ms. Timeout will be reported as an error.
     *
     * @param userId User id
     * @param item Item to be added
     * @returns A promise that's resolved with the updated ShoppingCart instance
     *
     */
    addItem(userId: string, item: ShoppingCartItem): Promise<ShoppingCart>;
    /**
     * Use Redis WATCH and Transaction to check and set against a key
     * See https://redis.io/topics/transactions#optimistic-locking-using-check-and-set
     *
     * Ideally, this method should be made available by `KeyValueRepository`.
     *
     * @param userId User id
     * @param check A function that checks the current value and produces a new
     * value. It returns `null` to abort.
     *
     * @returns A promise that's resolved with the updated ShoppingCart instance
     * or with null if the transaction failed due to a race condition.
     * See https://github.com/NodeRedis/node_redis#optimistic-locks
     */
    checkAndSet(userId: string, check: (current: ShoppingCart | null) => ShoppingCart | null): Promise<ShoppingCart | null>;
}
