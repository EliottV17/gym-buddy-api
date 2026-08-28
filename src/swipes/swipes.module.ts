import { Module } from '@nestjs/common';
import { SwipesService } from './swipes.service.js';
import { SwipesController } from './swipes.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Swipe])],
  providers: [SwipesService],
  controllers: [SwipesController]
})
export class SwipesModule { }
