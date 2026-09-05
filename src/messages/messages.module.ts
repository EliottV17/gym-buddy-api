import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity.js';
import { MessagesService } from './messages.service.js';
import { MessagesController } from './messages.controller.js';
import { MatchesModule } from '../matches/matches.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), MatchesModule],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
