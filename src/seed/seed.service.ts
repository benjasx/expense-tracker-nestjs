import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SEED_DATA } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,

    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async runSeed() {
    const stage = this.configService.get('STAGE');
    if (stage !== 'dev') {
      throw new UnauthorizedException(
        'No tienes permisos para ejecutar el Seed en este entorno.',
      );
    }

    try {
      await this.deleteTables();
      const users = await this.insertUsers();
      const categorias = await this.insertCategories();
      await this.insertExpenses(categorias, users);

      return {
        message:
          'Seed completado: Base de datos limpia y poblada con integridad.',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error ejecutando el Seed, revisa los logs.',
      );
    }
  }

  private async deleteTables() {
    await this.expenseRepo.query(
      'TRUNCATE TABLE expenses RESTART IDENTITY CASCADE',
    );
    await this.categoriaRepo.query(
      'TRUNCATE TABLE categoria RESTART IDENTITY CASCADE',
    );
    await this.userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  }

  private async insertUsers() {
    const { users: seedUsers } = SEED_DATA;

    const users = seedUsers.map((user) => {
      return this.userRepo.create({
        ...user,

        password: bcrypt.hashSync(user.password, 10),
      });
    });

    return await this.userRepo.save(users);
  }

  private async insertCategories() {
    const { categories: seedCategories } = SEED_DATA;

    const categories = seedCategories.map((cat) =>
      this.categoriaRepo.create(cat),
    );

    return await this.categoriaRepo.save(categories);
  }

  private async insertExpenses(categorias: Categoria[], users: User[]) {
    const { expenses } = SEED_DATA;

    const expensesEntities = expenses.map((expenseItem) => {
      const { categoryName, ...details } = expenseItem;
      const categoria = categorias.find((c) => c.nombre === categoryName);

      // Seleccionamos un usuario aleatorio de la lista
      const randomUser = users[Math.floor(Math.random() * users.length)];

      return this.expenseRepo.create({
        ...details,
        categoria,
        user: randomUser, // <--- Ahora varía en cada vuelta del loop
      });
    });

    await this.expenseRepo.save(expensesEntities);
  }
}
