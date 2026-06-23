import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
