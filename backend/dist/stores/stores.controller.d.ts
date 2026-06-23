import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(createStoreDto: CreateStoreDto): Promise<import("./entities/store.entity").Store>;
    getMyStore(req: any): Promise<any>;
    findAll(req: any, name?: string, address?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC'): Promise<any[]>;
    findOne(id: number): Promise<import("./entities/store.entity").Store>;
}
