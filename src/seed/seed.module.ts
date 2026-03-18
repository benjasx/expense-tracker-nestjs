import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Expense])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
