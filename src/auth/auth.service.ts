import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(LoginUserDtoDto: LoginUserDto) {
    const { email, password } = LoginUserDtoDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no válidas (password)');
    }

    const { password: _, ...rest } = user;

    return {
      ...rest,
      message: `Login exitoso, bienvenido ${user.fullName}!`,
      // TODO: Retornar el JWT aquí pronto
    };
  }
}
