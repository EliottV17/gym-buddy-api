import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Activity } from "../../shared/enums/activity.enum.js";
import { Availability } from "../../shared/enums/availability.enum.js";
import { ExperienceLevel } from "../../shared/enums/experience-level.enum.js";

export class UpdateProfileDto {
  @IsOptional() @IsEnum(Activity)
  activity?: Activity;

  @IsOptional() @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional() @IsEnum(Availability)
  availability?: Availability;

  @IsOptional() @IsNumber()
  latitude?: number;

  @IsOptional() @IsNumber()
  longitude?: number;
}
