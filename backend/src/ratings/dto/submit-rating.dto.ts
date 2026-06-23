import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class SubmitRatingDto {
  @IsNotEmpty({ message: 'Rating value is required.' })
  @IsInt({ message: 'Rating value must be an integer.' })
  @Min(1, { message: 'Rating value must be at least 1.' })
  @Max(5, { message: 'Rating value must be at most 5.' })
  score: number;

  @IsNotEmpty({ message: 'Store ID is required.' })
  @IsInt({ message: 'Store ID must be an integer.' })
  storeId: number;
}
