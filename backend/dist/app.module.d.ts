import { OnApplicationBootstrap } from '@nestjs/common';
import { Connection } from 'typeorm';
export declare class AppModule implements OnApplicationBootstrap {
    private readonly connection;
    constructor(connection: Connection);
    onApplicationBootstrap(): Promise<void>;
}
