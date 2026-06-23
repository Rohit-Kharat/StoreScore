"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
let StoresService = class StoresService {
    storesRepository;
    usersRepository;
    constructor(storesRepository, usersRepository) {
        this.storesRepository = storesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createStoreDto) {
        const existing = await this.storesRepository.findOne({ where: { email: createStoreDto.email } });
        if (existing) {
            throw new common_1.ConflictException('A store with this email already exists.');
        }
        let owner = null;
        if (createStoreDto.ownerId) {
            owner = await this.usersRepository.findOne({ where: { id: createStoreDto.ownerId } });
            if (!owner) {
                throw new common_1.NotFoundException('Assigned Store Owner not found.');
            }
            if (owner.role !== user_entity_1.UserRole.OWNER) {
                throw new common_1.BadRequestException('Assigned user must be a Store Owner.');
            }
            const existingStore = await this.storesRepository.findOne({ where: { ownerId: owner.id } });
            if (existingStore) {
                throw new common_1.ConflictException('This owner is already assigned to another store.');
            }
        }
        const store = this.storesRepository.create({
            name: createStoreDto.name,
            email: createStoreDto.email,
            address: createStoreDto.address,
            ownerId: createStoreDto.ownerId || null,
        });
        return this.storesRepository.save(store);
    }
    async findById(id) {
        const store = await this.storesRepository.findOne({
            where: { id },
            relations: { owner: true, ratings: { user: true } },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found.');
        }
        return store;
    }
    async findByOwnerId(ownerId) {
        const store = await this.storesRepository.findOne({
            where: { ownerId },
            relations: { ratings: { user: true } },
        });
        if (!store) {
            throw new common_1.NotFoundException('No store found registered under this owner.');
        }
        const ratings = store.ratings || [];
        const sum = ratings.reduce((acc, r) => acc + r.score, 0);
        const averageRating = ratings.length > 0 ? Number((sum / ratings.length).toFixed(2)) : 0;
        return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating,
            ratings: ratings.map((r) => ({
                id: r.id,
                score: r.score,
                date: r.createdAt,
                user: {
                    id: r.user.id,
                    name: r.user.name,
                    email: r.user.email,
                },
            })),
        };
    }
    async findAll(currentUserId, search, sortField = 'name', sortOrder = 'ASC') {
        const whereClause = {};
        if (search.name) {
            whereClause.name = (0, typeorm_2.Like)(`%${search.name}%`);
        }
        if (search.address) {
            whereClause.address = (0, typeorm_2.Like)(`%${search.address}%`);
        }
        const stores = await this.storesRepository.find({
            where: whereClause,
            relations: { ratings: { user: true }, owner: true },
        });
        let mappedStores = stores.map((store) => {
            const ratings = store.ratings || [];
            const sum = ratings.reduce((acc, r) => acc + r.score, 0);
            const overallRating = ratings.length > 0 ? Number((sum / ratings.length).toFixed(2)) : 0;
            const userRatingObj = ratings.find((r) => r.userId === currentUserId);
            const userRating = userRatingObj ? userRatingObj.score : null;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                owner: store.owner ? { id: store.owner.id, name: store.owner.name, email: store.owner.email } : null,
                overallRating,
                userRating,
                totalRatings: ratings.length,
            };
        });
        mappedStores.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === 'string')
                valA = valA.toLowerCase();
            if (typeof valB === 'string')
                valB = valB.toLowerCase();
            if (valA === undefined || valA === null)
                return sortOrder === 'ASC' ? -1 : 1;
            if (valB === undefined || valB === null)
                return sortOrder === 'ASC' ? 1 : -1;
            if (valA < valB)
                return sortOrder === 'ASC' ? -1 : 1;
            if (valA > valB)
                return sortOrder === 'ASC' ? 1 : -1;
            return 0;
        });
        return mappedStores;
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map