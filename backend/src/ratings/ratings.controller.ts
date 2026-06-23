import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // Only normal users can rate stores
  @Post()
  @Roles(UserRole.NORMAL)
  async submitRating(@Request() req, @Body() submitRatingDto: SubmitRatingDto) {
    return this.ratingsService.submitRating(req.user.id, submitRatingDto);
  }
}
