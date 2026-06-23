import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { Store } from '../stores/entities/store.entity';
export declare class RatingsService {
    private ratingsRepository;
    private storesRepository;
    constructor(ratingsRepository: Repository<Rating>, storesRepository: Repository<Store>);
    submitRating(userId: number, dto: SubmitRatingDto): Promise<Rating>;
}
