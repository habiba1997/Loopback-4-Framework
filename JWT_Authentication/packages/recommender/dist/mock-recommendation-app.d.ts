import { HttpServer } from '@loopback/http-server';
export declare function createRecommendationServer(port?: number, host?: string): HttpServer;
export declare function main(port?: number): Promise<HttpServer>;
