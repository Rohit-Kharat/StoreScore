import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Rating } from './ratings/entities/rating.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async getAdminStats() {
    const totalUsers = await this.userRepository.count();
    const totalStores = await this.storeRepository.count();
    const totalRatings = await this.ratingRepository.count();

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }
}
