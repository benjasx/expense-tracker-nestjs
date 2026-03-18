import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Categoria,
  TipoMovimiento,
} from '../categorias/entities/categoria.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,

    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async runSeed() {
    // 1. Limpiar la base de datos (Orden crítico por FK)
    await this.deleteTables();

    // 2. Crear categorías base
    const categorias = await this.insertCategories();

    // 3. Crear movimientos con fechas específicas
    await this.insertExpenses(categorias);

    return {
      message: 'Seed ejecutado con éxito. Base de datos poblada y limpia.',
    };
  }

  private async deleteTables() {
    try {
      // Usamos CASCADE para limpiar sin que las llaves foráneas nos bloqueen
      await this.expenseRepo.query(
        'TRUNCATE TABLE expenses RESTART IDENTITY CASCADE',
      );
      await this.categoriaRepo.query(
        'TRUNCATE TABLE categoria RESTART IDENTITY CASCADE',
      );
    } catch (error) {
      console.log(
        'Error limpiando tablas. Revisa si los nombres coinciden:',
        error,
      );
    }
  }

  private async insertCategories() {
    const seedCategories = [
      { nombre: 'sueldo', tipo: TipoMovimiento.INGRESO },
      { nombre: 'ventas taller', tipo: TipoMovimiento.INGRESO },
      { nombre: 'alimentacion', tipo: TipoMovimiento.GASTO },
      { nombre: 'renta', tipo: TipoMovimiento.GASTO },
      { nombre: 'ocio', tipo: TipoMovimiento.GASTO },
      { nombre: 'transporte', tipo: TipoMovimiento.GASTO },
      { nombre: 'repuestos', tipo: TipoMovimiento.GASTO },
    ];

    const categories = seedCategories.map((cat) =>
      this.categoriaRepo.create(cat),
    );
    return await this.categoriaRepo.save(categories);
  }

  private async insertExpenses(categorias: Categoria[]) {
    // Función de búsqueda segura para evitar el NULL en categoriaId
    const findCat = (nombre: string) => {
      const found = categorias.find(
        (c) => c.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
      );
      if (!found)
        throw new Error(
          `¡Error en el Seed! Categoría no encontrada: ${nombre}`,
        );
      return found;
    };

    const seedExpenses = [
      // --- MARZO 2026 (17 registros) ---
      {
        descripcion: 'Pago quincena marzo',
        monto: 5000,
        fecha: '2026-03-15',
        categoria: findCat('sueldo'),
      },
      {
        descripcion: 'Venta pantalla iPhone 13 Pro',
        monto: 2800,
        fecha: '2026-03-17',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Compra de pantallas LCD',
        monto: 1500,
        fecha: '2026-03-16',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Cena con amigos',
        monto: 450,
        fecha: '2026-03-14',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Gasolina taller',
        monto: 200,
        fecha: '2026-03-13',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Almuerzo económico',
        monto: 85,
        fecha: '2026-03-12',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Suscripción Netflix',
        monto: 199,
        fecha: '2026-03-11',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Venta cargador carga rápida',
        monto: 350,
        fecha: '2026-03-10',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Repuesto Pin de carga Moto G',
        monto: 120,
        fecha: '2026-03-09',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Supermercado semanal',
        monto: 900,
        fecha: '2026-03-08',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Pasajes bus',
        monto: 30,
        fecha: '2026-03-07',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Salida al Cine',
        monto: 300,
        fecha: '2026-03-06',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Cambio de batería iPhone SE',
        monto: 750,
        fecha: '2026-03-05',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Insumos (Estaño y Flux)',
        monto: 400,
        fecha: '2026-03-04',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Pago Renta Local Marzo',
        monto: 3000,
        fecha: '2026-03-01',
        categoria: findCat('renta'),
      },
      {
        descripcion: 'Desayuno taller',
        monto: 65,
        fecha: '2026-03-02',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Venta de funda uso rudo',
        monto: 180,
        fecha: '2026-03-03',
        categoria: findCat('ventas taller'),
      },

      // --- FEBRERO 2026 (17 registros) ---
      {
        descripcion: 'Pago quincena febrero 2',
        monto: 5000,
        fecha: '2026-02-28',
        categoria: findCat('sueldo'),
      },
      {
        descripcion: 'Venta iPhone 11 reacondicionado',
        monto: 4200,
        fecha: '2026-02-27',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Compra de pegamento B7000',
        monto: 180,
        fecha: '2026-02-26',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Tacos cena',
        monto: 150,
        fecha: '2026-02-25',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Gasolina moto',
        monto: 180,
        fecha: '2026-02-24',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Videojuego nuevo',
        monto: 1200,
        fecha: '2026-02-23',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Reparación Face ID',
        monto: 1500,
        fecha: '2026-02-22',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Lote de micas de cristal',
        monto: 500,
        fecha: '2026-02-20',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Comida corrida',
        monto: 95,
        fecha: '2026-02-19',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Suscripción Spotify',
        monto: 129,
        fecha: '2026-02-18',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Venta de cables USB',
        monto: 200,
        fecha: '2026-02-17',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Pago quincena febrero 1',
        monto: 5000,
        fecha: '2026-02-15',
        categoria: findCat('sueldo'),
      },
      {
        descripcion: 'Repuesto cámara Samsung S21',
        monto: 850,
        fecha: '2026-02-14',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Cena San Valentín',
        monto: 1100,
        fecha: '2026-02-14',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Despensa quincenal',
        monto: 1600,
        fecha: '2026-02-12',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Pasajes bus',
        monto: 45,
        fecha: '2026-02-10',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Pago Renta Local Febrero',
        monto: 3000,
        fecha: '2026-02-01',
        categoria: findCat('renta'),
      },

      // --- ENERO 2026 (16 registros) ---
      {
        descripcion: 'Pago quincena enero 2',
        monto: 5000,
        fecha: '2026-01-30',
        categoria: findCat('sueldo'),
      },
      {
        descripcion: 'Venta pantalla Tablet Lenovo',
        monto: 1800,
        fecha: '2026-01-28',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Compra estación de calor',
        monto: 3500,
        fecha: '2026-01-26',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Hamburguesas',
        monto: 220,
        fecha: '2026-01-24',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Salida fin de semana',
        monto: 600,
        fecha: '2026-01-23',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Gasolina moto',
        monto: 200,
        fecha: '2026-01-20',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Cambio de cristal Apple Watch',
        monto: 2200,
        fecha: '2026-01-18',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Lote de conectores FPC',
        monto: 300,
        fecha: '2026-01-17',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Pago quincena enero 1',
        monto: 5000,
        fecha: '2026-01-15',
        categoria: findCat('sueldo'),
      },
      {
        descripcion: 'Supermercado inicio mes',
        monto: 1800,
        fecha: '2026-01-13',
        categoria: findCat('alimentacion'),
      },
      {
        descripcion: 'Venta de audífonos Bluetooth',
        monto: 450,
        fecha: '2026-01-10',
        categoria: findCat('ventas taller'),
      },
      {
        descripcion: 'Mantenimiento PC taller',
        monto: 200,
        fecha: '2026-01-08',
        categoria: findCat('repuestos'),
      },
      {
        descripcion: 'Rosca de Reyes y Café',
        monto: 350,
        fecha: '2026-01-06',
        categoria: findCat('ocio'),
      },
      {
        descripcion: 'Pasajes bus',
        monto: 45,
        fecha: '2026-01-05',
        categoria: findCat('transporte'),
      },
      {
        descripcion: 'Pago Renta Local Enero',
        monto: 3000,
        fecha: '2026-01-01',
        categoria: findCat('renta'),
      },
      {
        descripcion: 'Pizza inicio de año',
        monto: 280,
        fecha: '2026-01-01',
        categoria: findCat('ocio'),
      },
    ];

    const expenses = seedExpenses.map((exp) => this.expenseRepo.create(exp));
    await this.expenseRepo.save(expenses);
  }
}
