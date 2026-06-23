import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Rating {
    id: number;
    score: number;
    userId: number;
    storeId: number;
    user: User;
    store: Store;
    createdAt: Date;
    updatedAt: Date;
}
