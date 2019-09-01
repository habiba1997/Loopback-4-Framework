import { juggler, AnyObject } from '@loopback/repository';
export declare class RecommenderDataSource extends juggler.DataSource {
    static dataSourceName: string;
    constructor(dsConfig?: AnyObject);
}
