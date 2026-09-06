import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { GeoPoint } from './types/user.types.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.save(createUserDto);
    const { passwordHash, ...result } = user;
    return result;
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) return null;

    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const { latitude, longitude, ...rest } = updateProfileDto;

    const updateData: QueryDeepPartialEntity<User> = { ...rest };

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    const result = await this.userRepository.update(userId, updateData);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.findOneById(userId);
  }

  async findSuggestions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Omit<User, 'passwordHash'>[]> {
    const validPage = Math.max(1, page || 1);
    const validLimit = Math.max(1, Math.min(limit || 10, 50));
    const offset = (validPage - 1) * validLimit;

    const user = await this.userRepository.findOneBy({ id: userId });

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .leftJoin(
        'swipes',
        'swipe',
        'swipe.swiped_id = user.id AND swipe.swiper_id = :userId',
        { userId },
      )
      .where('user.id != :userId', { userId })
      .andWhere('swipe.id IS NULL');

    if (!user || !user.location) {
      queryBuilder.orderBy('user.created_at', 'DESC');
    } else {
      const coords = user.location as GeoPoint;
      const distanceExpr = `ST_Distance(user.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography)`;

      queryBuilder
        .addSelect(`${distanceExpr}`, 'distance')
        .setParameters({
          longitude: coords.coordinates[0],
          latitude: coords.coordinates[1],
        })
        .orderBy('distance', 'ASC')
        .addOrderBy('user.created_at', 'DESC');
    }

    queryBuilder.skip(offset).take(validLimit);

    const users = await queryBuilder.getMany();

    return users.map((u) => {
      const { passwordHash, ...cleanUser } = u;
      return cleanUser;
    });
  }
}
