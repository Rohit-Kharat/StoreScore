import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from '../users/entities/user.entity';
export declare class StoresService {
    private storesRepository;
    private usersRepository;
    constructor(storesRepository: Repository<Store>, usersRepository: Repository<User>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findById(id: number): Promise<Store>;
    findByOwnerId(ownerId: number): Promise<any>;
    findAll(currentUserId: number, search: {
        name?: string;
        address?: string;
    }, sortField?: string, sortOrder?: 'ASC' | 'DESC'): Promise<any[]>;
}
