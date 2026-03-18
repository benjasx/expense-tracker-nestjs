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
import { SearchExpenseDto } from './dto/search-expense.dto';

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

  // src/expenses/expenses.service.ts
  async findAll(searchDto: SearchExpenseDto) {
    const {
      limit = 12,
      offset = 0,
      term,
      categoriaId,
      minMonto,
      maxMonto,
      startDate,
      endDate,
      tipo,
    } = searchDto;

    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.categoria', 'categoria');

    // 1. Filtro de Fechas
    if (startDate && endDate) {
      queryBuilder.andWhere('expense.fecha BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    // 2. Filtro por descripción (Term)
    if (term) {
      queryBuilder.andWhere('LOWER(expense.descripcion) LIKE :term', {
        term: `%${term.toLowerCase()}%`,
      });
    }

    if (tipo) {
      queryBuilder.andWhere('categoria.tipo = :tipo', { tipo });
    }

    // 3. Filtro por Categoría ID
    if (categoriaId) {
      queryBuilder.andWhere('categoria.id = :categoriaId', { categoriaId });
    }

    // 4. Filtro por Monto Mayor o igual
    if (minMonto) {
      queryBuilder.andWhere('expense.monto >= :minMonto', { minMonto });
    }

    if (maxMonto) {
      queryBuilder.andWhere('expense.monto <= :maxMonto', { maxMonto });
    }
    queryBuilder.orderBy('expense.fecha', 'DESC').take(limit).skip(offset);

    const [expenses, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      limit,
      offset,
      data: expenses,
    };
  }

  async getCategoryBreakdown(startDate?: string, endDate?: string) {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      // Usamos alias claros para evitar conflictos con los nombres de las tablas
      .select('categoria.nombre', 'nombre')
      .addSelect('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .groupBy('categoria.nombre')
      .addGroupBy('categoria.tipo')
      // Ordenamos de mayor a menor gasto/ingreso para que lo más importante salga arriba
      .orderBy('SUM(expense.monto)', 'DESC');

    // Filtro de fechas mejorado: ahora funciona aunque solo mandes una
    if (startDate && endDate) {
      query.andWhere('expense.fecha BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    } else if (startDate) {
      query.andWhere('expense.fecha >= :start', { start: startDate });
    } else if (endDate) {
      query.andWhere('expense.fecha <= :end', { end: endDate });
    }

    const resultado = await query.getRawMany();

    // Retornamos un mapeo limpio y aseguramos que el total sea número
    return resultado.map((item) => ({
      categoria: item.nombre,
      tipo: item.tipo,
      total: Number(item.total) || 0,
    }));
  }

  async findOne(id: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!expense)
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);

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
    // 1. Consulta del Rango Seleccionado
    const queryFiltrada = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .groupBy('categoria.tipo');

    if (startDate && endDate) {
      queryFiltrada.andWhere('expense.fecha BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const resumenFiltrado = await queryFiltrada.getRawMany();

    // 2. Consulta Global (Fondo acumulado)
    const resumenGlobal = await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .groupBy('categoria.tipo')
      .getRawMany();

    // 3. Estructura Plana
    let ingresosPeriodo = 0;
    let gastosPeriodo = 0;
    let fondoTotal = 0;

    resumenFiltrado.forEach((row) => {
      const monto = parseFloat(row.total);
      if (row.tipo === 'ingreso') ingresosPeriodo = monto;
      if (row.tipo === 'gasto') gastosPeriodo = monto;
    });

    resumenGlobal.forEach((row) => {
      const monto = parseFloat(row.total);
      if (row.tipo === 'ingreso') fondoTotal += monto;
      if (row.tipo === 'gasto') fondoTotal -= monto;
    });

    return {
      ingresosPeriodo,
      gastosPeriodo,
      totalPeriodo: ingresosPeriodo - gastosPeriodo,
      fondoTotal,
      fechaInicio: startDate || 'El Big Bang',
      fechaFin: endDate || 'Hoy Merengues',
    };
  }
}
