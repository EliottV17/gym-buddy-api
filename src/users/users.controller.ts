import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { User } from './entities/user.entity.js';
import type { AuthRequest } from './types/user.types.js';

interface TypedRequest extends ExpressRequest {
  user: AuthRequest;
}

@Controller('profile')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: TypedRequest): Promise<User | null> {
    return this.usersService.findOneById(req.user.sub);
  }

  @Patch('me')
  updateProfile(
    @Request() req: TypedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User | null> {
    return this.usersService.updateProfile(req.user.sub, updateProfileDto);
  }

  @Get('suggestions')
  getSuggestions(
    @Request() req: TypedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<User[]> {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10));
    const limitNum = Math.min(20, Math.max(1, parseInt(limit ?? '20', 10)));
    return this.usersService.findSuggestions(req.user.sub, pageNum, limitNum);
  }
}
