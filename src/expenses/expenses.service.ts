import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { SearchExpenseDto } from './dto/search-expense.dto';
import { Expense } from './entities/expense.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    const { categoriaId, fecha, ...detallesGasto } = createExpenseDto;

    const categoria = await this.categoriaRepository.findOneBy({
      id: categoriaId,
    });
    if (!categoria)
      throw new NotFoundException(
        `Categoría con ID ${categoriaId} no encontrada`,
      );

    try {
      const expense = this.expenseRepository.create({
        ...detallesGasto,
        // Si no viene fecha, ponemos la de hoy por defecto
        fecha: fecha || new Date().toISOString().split('T')[0],
        categoria,
        user,
      });

      const { categoria: catEntity, ...registroGuardado } =
        await this.expenseRepository.save(expense);

      return {
        ...registroGuardado,
        categoria: categoria.nombre,
        tipoMovimiento: categoria.tipo,
        userId: user.id,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(searchDto: SearchExpenseDto, user: User) {
    const {
      limit = 12,
      offset = 0,
      sortBy = 'fecha',
      order = 'DESC',
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
      .leftJoinAndSelect('expense.categoria', 'categoria')
      .leftJoinAndSelect('expense.user', 'user')
      .where('expense.user.id = :userId', { userId: user.id });

    // --- FILTROS ---
    if (startDate && endDate) {
      queryBuilder.andWhere('expense.fecha BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    if (term) {
      queryBuilder.andWhere('LOWER(expense.descripcion) LIKE :term', {
        term: `%${term.toLowerCase()}%`,
      });
    }

    if (tipo) {
      queryBuilder.andWhere('categoria.tipo = :tipo', { tipo });
    }

    if (categoriaId) {
      queryBuilder.andWhere('categoria.id = :categoriaId', { categoriaId });
    }

    if (minMonto)
      queryBuilder.andWhere('expense.monto >= :minMonto', { minMonto });
    if (maxMonto)
      queryBuilder.andWhere('expense.monto <= :maxMonto', { maxMonto });

    // --- ORDENAMIENTO BLINDADO ---
    const validColumns = ['fecha', 'monto', 'descripcion'];
    const finalOrder = order.toUpperCase() as 'ASC' | 'DESC';
    let sortColumn: string;

    if (sortBy === 'categoria') {
      sortColumn = 'categoria.nombre';
    } else if (validColumns.includes(sortBy)) {
      sortColumn = `expense.${sortBy}`;
    } else {
      sortColumn = 'expense.fecha'; // Fallback seguro
    }

    // Aplicamos el orden principal
    queryBuilder.orderBy(sortColumn, finalOrder);

    // Añadimos fecha como segundo criterio solo si no es el principal
    if (sortBy !== 'fecha') {
      queryBuilder.addOrderBy('expense.fecha', 'DESC');
    }

    // --- PAGINACIÓN ---
    queryBuilder.take(limit).skip(offset);

    const [expenses, total] = await queryBuilder.getManyAndCount();

    return { total, limit, offset, data: expenses };
  }

  async getCategoryBreakdown(user: User, searchDto: SearchExpenseDto) {
    const startDate = searchDto?.startDate || '2026-01-01';
    const endDate =
      searchDto?.endDate || new Date().toISOString().split('T')[0];

    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.nombre', 'nombre')
      .addSelect('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .where('expense.user.id = :userId', { userId: user.id })
      .groupBy('categoria.nombre')
      .addGroupBy('categoria.tipo')
      .orderBy('SUM(expense.monto)', 'DESC');

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

    return resultado.map((item) => ({
      categoria: item.nombre,
      tipo: item.tipo,
      total: Number(item.total) || 0,
    }));
  }

  async getAnalysis(user: User, searchDto: SearchExpenseDto) {
    const { startDate, endDate } = searchDto;

    // 1. Consulta del Rango Seleccionado (Filtrada por Usuario y Fecha)
    const queryFiltrada = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      // --- FILTRO DE USUARIO ---
      .where('expense.user.id = :userId', { userId: user.id })
      .groupBy('categoria.tipo');

    if (startDate && endDate) {
      queryFiltrada.andWhere('expense.fecha BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const resumenFiltrado = await queryFiltrada.getRawMany();

    // 2. Consulta Global (FILTRADA POR USUARIO)
    // Sin este filtro, el fondoTotal sumaría el dinero de todo
    const resumenGlobal = await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.categoria', 'categoria')
      .select('categoria.tipo', 'tipo')
      .addSelect('SUM(expense.monto)', 'total')
      .where('expense.user.id = :userId', { userId: user.id }) // <---
      .groupBy('categoria.tipo')
      .getRawMany();

    let ingresosPeriodo = 0;
    let gastosPeriodo = 0;
    let fondoTotal = 0;

    // Procesamos el resumen del periodo (el rango de fechas)
    resumenFiltrado.forEach((row) => {
      const monto = Number(row.total);
      if (row.tipo === 'ingreso') ingresosPeriodo = monto;
      if (row.tipo === 'gasto') gastosPeriodo = monto;
    });

    // Procesamos el fondo total (histórico del usuario)
    resumenGlobal.forEach((row) => {
      const monto = Number(row.total);
      if (row.tipo === 'ingreso') fondoTotal += monto;
      if (row.tipo === 'gasto') fondoTotal -= monto;
    });

    return {
      ingresosPeriodo,
      gastosPeriodo,
      totalPeriodo: ingresosPeriodo - gastosPeriodo,
      fondoTotal, // Dinero real disponible de este usuario específico
      fechaInicio: startDate || 'Inicio de los tiempos',
      fechaFin: endDate || 'Hoy',
    };
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

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: User) {
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
      expense.user = user; // Aseguramos que el usuario no se pierda en la actualización
      await this.expenseRepository.save(expense);
      return this.findOne(id);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense)
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);

    await this.expenseRepository.remove(expense);
    return {
      message: `El gasto "${expense.descripcion}" por $${expense.monto} fue eliminado con éxito.`,
      deletedId: id,
    };
  }

  private handleDBErrors(error: any): never {
    console.error(error);
    if (error.code === '23505')
      throw new BadRequestException('Registro duplicado en la base de datos');
    if (error.code === '22P02')
      throw new BadRequestException('ID o formato de dato inválido');

    throw new InternalServerErrorException(
      'Error inesperado, revisa los logs del servidor',
    );
  }
}
