import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Activity } from '../../shared/enums/activity.enum.js';
import { Availability } from '../../shared/enums/availability.enum.js';
import { ExperienceLevel } from '../../shared/enums/experience-level.enum.js';

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(Activity)
  activity?: Activity;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsEnum(Availability)
  availability?: Availability;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  gymName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplines?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  searchDistanceKm?: number;
}
