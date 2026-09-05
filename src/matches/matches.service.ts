import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity.js';

export interface MatchResponse {
  id: string;
  createdAt: Date;
  partner: {
    id: string;
    firstName: string;
    activity: string | null;
    experienceLevel: string | null;
    location: { type: string; coordinates: [number, number] } | null;
  };
}

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(userA: string, userB: string): Promise<Match | null> {
    const [user1, user2] = [userA, userB].sort();

    try {
      const match = this.matchRepository.create({
        user1: { id: user1 },
        user2: { id: user2 },
      });
      return await this.matchRepository.save(match);
    } catch {
      return null;
    }
  }

  // --- Paso 3 ---
  async findAll(userId: string): Promise<MatchResponse[]> {
    const matches = await this.matchRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: { user1: true, user2: true },
      order: { createdAt: 'DESC' },
    });

    return matches.map((match) => {
      const partner = match.user1.id === userId ? match.user2 : match.user1;
      return {
        id: match.id,
        createdAt: match.createdAt,
        partner: {
          id: partner.id,
          firstName: partner.firstName,
          activity: partner.activity,
          experienceLevel: partner.experienceLevel,
          location: partner.location,
        },
      };
    });
  }

  async findOne(userId: string, matchId: string): Promise<MatchResponse> {
    const match = await this.matchRepository.findOne({
      where: [
        { id: matchId, user1: { id: userId } },
        { id: matchId, user2: { id: userId } },
      ],
      relations: { user1: true, user2: true },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const partner = match.user1.id === userId ? match.user2 : match.user1;
    return {
      id: match.id,
      createdAt: match.createdAt,
      partner: {
        id: partner.id,
        firstName: partner.firstName,
        activity: partner.activity,
        experienceLevel: partner.experienceLevel,
        location: partner.location,
      },
    };
  }
}
