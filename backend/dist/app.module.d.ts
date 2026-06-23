import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class AppModule implements OnApplicationBootstrap {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
}
