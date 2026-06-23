import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    address: string;
    password: string;
    role: UserRole;
}
