import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Rating } from './ratings/entities/rating.entity';
export declare class AppService {
    private userRepository;
    private storeRepository;
    private ratingRepository;
    constructor(userRepository: Repository<User>, storeRepository: Repository<Store>, ratingRepository: Repository<Rating>);
    getAdminStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
