import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer"

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
