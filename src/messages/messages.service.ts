import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { MatchesService } from '../matches/matches.service.js';

export interface MessageResponse {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    firstName: string;
  };
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly matchesService: MatchesService,
  ) {}

  async create(
    userId: string,
    matchId: string,
    dto: CreateMessageDto,
  ): Promise<MessageResponse> {
    await this.matchesService.findOne(userId, matchId);

    const message = this.messageRepository.create({
      content: dto.content,
      match: { id: matchId },
      sender: { id: userId },
    });
    const saved = await this.messageRepository.save(message);
    return this.toResponse(saved);
  }

  async findAll(userId: string, matchId: string): Promise<MessageResponse[]> {
    await this.matchesService.findOne(userId, matchId);

    const messages = await this.messageRepository.find({
      where: { match: { id: matchId } },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
      take: 50,
    });

    return messages.map((msg) => this.toResponse(msg));
  }

  private toResponse(message: Message): MessageResponse {
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        firstName: message.sender.firstName,
      },
    };
  }
}
