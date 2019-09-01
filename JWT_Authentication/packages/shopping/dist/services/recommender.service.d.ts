import { Provider } from '@loopback/core';
import { RecommenderDataSource } from '../datasources/recommender.datasource';
import { Product } from '../models';
export interface RecommenderService {
    getProductRecommendations(userId: string): Promise<Product[]>;
}
export declare class RecommenderServiceProvider implements Provider<RecommenderService> {
    protected datasource: RecommenderDataSource;
    constructor(datasource: RecommenderDataSource);
    value(): Promise<RecommenderService>;
}
