import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { HashingService } from '../hashing/hashing.service.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant.js';

@Module({
  imports: [UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })],
  providers: [HashingService, AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
