import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { MatchesService, MatchResponse } from './matches.service.js';

interface MatchesRequest extends ExpressRequest {
  user: { sub: string };
}

@Controller('matches')
@UseGuards(AuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  findAll(@Request() req: MatchesRequest): Promise<MatchResponse[]> {
    return this.matchesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Request() req: MatchesRequest,
    @Param('id', ParseUUIDPipe) matchId: string,
  ): Promise<MatchResponse> {
    return this.matchesService.findOne(req.user.sub, matchId);
  }
}
