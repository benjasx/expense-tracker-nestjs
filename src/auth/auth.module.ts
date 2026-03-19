import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // 1. Le damos permiso al AuthModule para usar la tabla de usuarios
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
