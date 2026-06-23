import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare class Store {
    id: number;
    name: string;
    email: string;
    address: string;
    ownerId: number | null;
    owner: User | null;
    createdAt: Date;
    updatedAt: Date;
    ratings: Rating[];
}
