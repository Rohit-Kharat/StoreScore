import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User>;
    updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    findAll(filters: {
        name?: string;
        email?: string;
        address?: string;
        role?: string;
    }, sortField?: string, sortOrder?: 'ASC' | 'DESC'): Promise<User[]>;
    findOneWithStoreRating(id: number): Promise<any>;
}
