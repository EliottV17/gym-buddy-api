import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity.js';
import { SwipesService } from './swipes.service.js';
import { SwipesController } from './swipes.controller.js';
import { MatchesModule } from '../matches/matches.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Swipe]), MatchesModule],
  providers: [SwipesService],
  controllers: [SwipesController],
})
export class SwipesModule {}
