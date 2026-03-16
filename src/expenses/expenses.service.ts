import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const { categoriaId, ...detallesGasto } = createExpenseDto;

    const categoria = await this.categoriaRepository.findOneBy({
      id: categoriaId,
    });
    if (!categoria) {
      throw new Error(`Categoría con ID ${categoriaId} no encontrada`);
    }

    try {
      // 2. Creamos la instancia del gasto y le asignamos la categoría encontrada
      const gasto = this.expenseRepository.create({
        ...detallesGasto,
        categoria: categoria, // Aquí pasamos el objeto completo
      });

      // 3. Guardamos en la DB
      return await this.expenseRepository.save(gasto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear el gasto, revisa los logs',
      );
    }
  }

  findAll() {
    return `This action returns all expenses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
