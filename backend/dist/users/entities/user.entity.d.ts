import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';
export declare enum UserRole {
    ADMIN = "admin",
    NORMAL = "normal",
    OWNER = "owner"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password?: string;
    address: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    ratings: Rating[];
    store?: Store;
}
