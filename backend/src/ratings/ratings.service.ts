import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async submitRating(userId: number, dto: SubmitRatingDto): Promise<Rating> {
    const store = await this.storesRepository.findOne({ where: { id: dto.storeId } });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    // Check if rating already exists for this user and store
    let rating = await this.ratingsRepository.findOne({
      where: { userId, storeId: dto.storeId },
    });

    if (rating) {
      // Modify existing rating
      rating.score = dto.score;
    } else {
      // Submit new rating
      rating = this.ratingsRepository.create({
        userId,
        storeId: dto.storeId,
        score: dto.score,
      });
    }

    return this.ratingsRepository.save(rating);
  }
}
