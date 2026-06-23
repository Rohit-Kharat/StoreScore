import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    submitRating(req: any, submitRatingDto: SubmitRatingDto): Promise<import("./entities/rating.entity").Rating>;
}
