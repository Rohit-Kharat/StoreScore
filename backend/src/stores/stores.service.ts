import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const existing = await this.storesRepository.findOne({ where: { email: createStoreDto.email } });
    if (existing) {
      throw new ConflictException('A store with this email already exists.');
    }

    let owner: User | null = null;
    if (createStoreDto.ownerId) {
      owner = await this.usersRepository.findOne({ where: { id: createStoreDto.ownerId } });
      if (!owner) {
        throw new NotFoundException('Assigned Store Owner not found.');
      }
      if (owner.role !== UserRole.OWNER) {
        throw new BadRequestException('Assigned user must be a Store Owner.');
      }

      // Check if this owner already owns a store
      const existingStore = await this.storesRepository.findOne({ where: { ownerId: owner.id } });
      if (existingStore) {
        throw new ConflictException('This owner is already assigned to another store.');
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

  async findById(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: { owner: true, ratings: { user: true } },
    });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }
    return store;
  }

  async findByOwnerId(ownerId: number): Promise<any> {
    const store = await this.storesRepository.findOne({
      where: { ownerId },
      relations: { ratings: { user: true } },
    });

    if (!store) {
      throw new NotFoundException('No store found registered under this owner.');
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

  async findAll(
    currentUserId: number,
    search: { name?: string; address?: string },
    sortField: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<any[]> {
    const whereClause: any = {};
    if (search.name) {
      whereClause.name = Like(`%${search.name}%`);
    }
    if (search.address) {
      whereClause.address = Like(`%${search.address}%`);
    }

    const stores = await this.storesRepository.find({
      where: whereClause,
      relations: { ratings: { user: true }, owner: true },
    });

    // Map stores to include average rating and current user's rating
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

    // Sorting in JS to support easy computed rating sorts
    mappedStores.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle fallback and casing
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA === undefined || valA === null) return sortOrder === 'ASC' ? -1 : 1;
      if (valB === undefined || valB === null) return sortOrder === 'ASC' ? 1 : -1;

      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return mappedStores;
  }
}
