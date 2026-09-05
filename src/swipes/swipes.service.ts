import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swipe } from './entities/swipe.entity.js';
import { CreateSwipeDto } from './dto/create-swipe.dto.js';
import { SwipeAction } from './swipe-action.enum.js';
import { MatchesService } from '../matches/matches.service.js';

@Injectable()
export class SwipesService {
  constructor(
    @InjectRepository(Swipe)
    private readonly swipeRepository: Repository<Swipe>,
    private readonly matchesService: MatchesService,
  ) {}

  async create(
    userId: string,
    dto: CreateSwipeDto,
  ): Promise<{ swipe: Swipe; matched: boolean }> {
    if (userId === dto.swipedId) {
      throw new BadRequestException('You cannot swipe yourself');
    }

    let swipe: Swipe;
    try {
      swipe = await this.swipeRepository.save({
        swiper: { id: userId },
        swiped: { id: dto.swipedId },
        action: dto.action,
      });
    } catch {
      throw new ConflictException('You already swiped this user');
    }

    if (dto.action !== SwipeAction.LIKE) {
      return { swipe, matched: false };
    }

    const reverseSwipe = await this.swipeRepository.findOne({
      where: {
        swiper: { id: dto.swipedId },
        swiped: { id: userId },
        action: SwipeAction.LIKE,
      },
    });

    if (reverseSwipe) {
      await this.matchesService.create(userId, dto.swipedId);
      return { swipe, matched: true };
    }

    return { swipe, matched: false };
  }
}
