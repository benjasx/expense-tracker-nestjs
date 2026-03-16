import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [
    // ¡ESTO ES LO QUE CREA LA TABLA!
    TypeOrmModule.forFeature([Expense]),
  ],
})
export class ExpensesModule {}
