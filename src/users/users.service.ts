import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { GeoPoint } from './types/user.types.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User | null> {
    const { latitude, longitude, ...rest } = updateProfileDto;

    const updateData: Partial<User> = { ...rest };

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOneBy({ id: userId });
  }

  async findSuggestions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<User[]> {
    const user = await this.userRepository.findOneBy({ id: userId });

    const swipeSubQuery = (qb: SelectQueryBuilder<User>) =>
      qb
        .select('"swiped_id"')
        .from('swipes', 'swipes')
        .where('"swiper_id" = :userId', { userId });

    if (!user || !user.location) {
      return this.userRepository
        .createQueryBuilder('user')
        .where('user.id != :userId', { userId })
        .andWhere(
          `user.id NOT IN (${swipeSubQuery(this.userRepository.createQueryBuilder()).getQuery()})`,
          { userId },
        )
        .orderBy('user.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    }

    const maxDistanceMeters = (user.searchDistanceKm ?? 10) * 1000;
    const coords = user.location as GeoPoint;

    const distanceExpr = `ST_Distance(user.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography)`;

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere(`${distanceExpr} <= :maxDistance`, {
        longitude: coords.coordinates[0],
        latitude: coords.coordinates[1],
        maxDistance: maxDistanceMeters,
      })
      .andWhere(
        `user.id NOT IN (${swipeSubQuery(this.userRepository.createQueryBuilder()).getQuery()})`,
        { userId },
      )
      .orderBy(distanceExpr, 'ASC')
      .addOrderBy('user.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}
