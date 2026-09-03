import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { latitude, longitude, ...rest } = updateProfileDto;

    const updateData: any = { ...rest };

    if (latitude && longitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOneBy({ id: userId });
  }
}
