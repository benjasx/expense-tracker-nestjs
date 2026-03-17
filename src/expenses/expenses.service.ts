import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(
        `Categoría con ID ${categoriaId} no encontrada`,
      );
    }

    try {
      const expense = this.expenseRepository.create({
        ...detallesGasto,
        categoria,
      });

      const { categoria: catEntity, ...registroGuardado } =
        await this.expenseRepository.save(expense);
      return {
        ...registroGuardado,
        categoria: categoria.nombre,
        tipoMovimiento: categoria.tipo,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    const expenses = await this.expenseRepository.find({
      relations: ['categoria'],
    });

    return expenses.map(({ categoria, ...rest }) => ({
      ...rest,
      categoria: categoria?.nombre || 'Sin categoría',
      tipoMovimiento: categoria.tipo,
    }));
  }

  async findOne(id: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!expense)
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);

    // Retornamos el objeto aplanado
    const { categoria, ...rest } = expense;
    return {
      ...rest,
      categoria: categoria?.nombre || 'sin categoría',
    };
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const { categoriaId, ...detallesUpdate } = updateExpenseDto;

    const expense = await this.expenseRepository.preload({
      id,
      ...detallesUpdate,
    });

    if (!expense)
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);

    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOneBy({
        id: categoriaId,
      });
      if (!categoria)
        throw new NotFoundException(`La categoría ${categoriaId} no existe`);
      expense.categoria = categoria;
    }

    try {
      await this.expenseRepository.save(expense);

      return this.findOne(id);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const expense = await this.expenseRepository.findOneBy({ id });

    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    await this.expenseRepository.remove(expense);

    return {
      message: `El gasto "${expense.descripcion}" por $${expense.monto} fue eliminado con éxito.`,
      deletedId: id,
    };
  }

  private handleDBErrors(error: any): never {
    console.log(error);
    if (error.code === '23505')
      throw new BadRequestException('Registro duplicado');

    throw new InternalServerErrorException(
      'Error inesperado, revisa los logs del servidor',
    );
  }

  async getAnalysis(startDate?: string, endDate?: string) {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .groupBy('categoria.tipo');

    // Filtro dinámico por fechas
    if (startDate && endDate) {
      // Usamos >= y <= para incluir los días límite
      query.andWhere('expense.createdAt BETWEEN :start AND :end', {
        start: `${startDate} 00:00:00`,
        end: `${endDate} 23:59:59`,
      });
    }

    const resumen = await query.getRawMany();

    // ... (el resto de la lógica de formateo de stats que ya teníamos)
    const stats = { ingresos: 0, gastos: 0, total: 0 };
    resumen.forEach((row) => {
      if (row.tipo === 'ingreso') stats.ingresos = parseFloat(row.total);
      if (row.tipo === 'gasto') stats.gastos = parseFloat(row.total);
    });
    stats.total = stats.ingresos - stats.gastos;

    return stats;
  }
}
