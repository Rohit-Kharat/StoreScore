import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updatePassword(req: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(name?: string, email?: string, address?: string, role?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC'): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<any>;
}
