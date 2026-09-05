import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { MessagesService, MessageResponse } from './messages.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

interface MessagesRequest extends ExpressRequest {
  user: { sub: string };
}

@Controller('matches/:matchId/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(
    @Request() req: MessagesRequest,
    @Param('matchId', ParseUUIDPipe) matchId: string,
  ): Promise<MessageResponse[]> {
    return this.messagesService.findAll(req.user.sub, matchId);
  }

  @Post()
  create(
    @Request() req: MessagesRequest,
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponse> {
    return this.messagesService.create(req.user.sub, matchId, createMessageDto);
  }
}
