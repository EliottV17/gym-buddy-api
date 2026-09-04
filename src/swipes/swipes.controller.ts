import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { SwipesService } from './swipes.service.js';
import { CreateSwipeDto } from './dto/create-swipe.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { Swipe } from './entities/swipe.entity.js';

interface SwipesRequest extends ExpressRequest {
  user: { sub: string };
}

@Controller('swipes')
@UseGuards(AuthGuard)
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Post()
  create(
    @Request() req: SwipesRequest,
    @Body() createSwipeDto: CreateSwipeDto,
  ): Promise<{ swipe: Swipe; matched: boolean }> {
    return this.swipesService.create(req.user.sub, createSwipeDto);
  }
}
