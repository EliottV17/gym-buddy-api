import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { SwipesModule } from './swipes/swipes.module.js';
import { MatchesModule } from './matches/matches.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // 1. Importa el JwtModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Configura el JwtModule de manera global usando tus variables de entorno
    JwtModule.registerAsync({
      global: true, // ✨ Esto lo hace accesible en toda la aplicación
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Puedes ajustar el tiempo de expiración aquí
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    AuthModule,
    UsersModule,
    SwipesModule,
    MatchesModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
