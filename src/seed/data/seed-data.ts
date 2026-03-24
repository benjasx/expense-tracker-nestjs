import { TipoMovimiento } from '../../categorias/entities/categoria.entity';

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
}

interface SeedCategory {
  nombre: string;
  tipo: TipoMovimiento;
}

interface SeedExpense {
  descripcion: string;
  monto: number;
  fecha: string;
  categoryName: string; // Usamos el nombre para buscarla en el servicio
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
  expenses: SeedExpense[];
}

export const SEED_DATA: SeedData = {
  users: [
    {
      email: 'benja@correo.com',
      password: '123456Password', // El servicio se encargará de encriptarla
      fullName: 'Benja Developer',
      roles: ['admin'],
    },
    {
      email: 'tecnico@taller.com',
      password: 'password123',
      fullName: 'Juan Perez',
      roles: ['user'],
    },
  ],

  categories: [
    // --- INGRESOS ---
    { nombre: 'sueldo fijo', tipo: TipoMovimiento.INGRESO },
    { nombre: 'servicios reparacion', tipo: TipoMovimiento.INGRESO },
    { nombre: 'venta productos', tipo: TipoMovimiento.INGRESO },
    { nombre: 'inversiones', tipo: TipoMovimiento.INGRESO },
    { nombre: 'otros ingresos', tipo: TipoMovimiento.INGRESO },
    { nombre: 'fondo inicial', tipo: TipoMovimiento.INGRESO },

    // --- GASTOS NEGOCIO ---
    { nombre: 'renta local', tipo: TipoMovimiento.GASTO },
    { nombre: 'repuestos', tipo: TipoMovimiento.GASTO },
    { nombre: 'herramientas', tipo: TipoMovimiento.GASTO },
    { nombre: 'publicidad', tipo: TipoMovimiento.GASTO },
    { nombre: 'mensajeria', tipo: TipoMovimiento.GASTO },

    // --- GASTOS PERSONALES / FIJOS ---
    { nombre: 'alimentacion', tipo: TipoMovimiento.GASTO },
    { nombre: 'pago de luz', tipo: TipoMovimiento.GASTO },
    { nombre: 'pago de agua', tipo: TipoMovimiento.GASTO },
    { nombre: 'internet y telefonia', tipo: TipoMovimiento.GASTO },
    { nombre: 'transporte y/o gasolina', tipo: TipoMovimiento.GASTO },
    { nombre: 'ocio', tipo: TipoMovimiento.GASTO },
    { nombre: 'suscripciones', tipo: TipoMovimiento.GASTO },
    { nombre: 'viajes y/o salidas', tipo: TipoMovimiento.GASTO },
    { nombre: 'salud', tipo: TipoMovimiento.GASTO },
    { nombre: 'educacion', tipo: TipoMovimiento.GASTO },
    { nombre: 'gastos hormiga', tipo: TipoMovimiento.GASTO },
  ],

  expenses: [
    // --- ENERO 2026 (Inicio de año y equipamiento) ---
    {
      descripcion: 'Fondo inicial para operación',
      monto: 25000,
      fecha: '2026-01-01',
      categoryName: 'fondo inicial',
    },
    {
      descripcion: 'Renta Local Enero',
      monto: 3500,
      fecha: '2026-01-01',
      categoryName: 'renta local',
    },
    {
      descripcion: 'Suscripción Netflix y Spotify',
      monto: 350,
      fecha: '2026-01-05',
      categoryName: 'suscripciones',
    },
    {
      descripcion: 'Compra Estación de calor Sugon',
      monto: 4200,
      fecha: '2026-01-10',
      categoryName: 'herramientas',
    },
    {
      descripcion: 'Quincena 1 Enero',
      monto: 6000,
      fecha: '2026-01-15',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Venta Pantalla iPhone 12',
      monto: 2500,
      fecha: '2026-01-18',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Cambio de Centro de Carga A54',
      monto: 850,
      fecha: '2026-01-20',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Gasolina Moto quincenal',
      monto: 250,
      fecha: '2026-01-22',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Café y donas (antojo)',
      monto: 120,
      fecha: '2026-01-25',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Pago Internet Taller',
      monto: 599,
      fecha: '2026-01-28',
      categoryName: 'internet y telefonia',
    },

    // --- FEBRERO 2026 (Mes de San Valentín y Repuestos) ---
    {
      descripcion: 'Renta Local Febrero',
      monto: 3500,
      fecha: '2026-02-01',
      categoryName: 'renta local',
    },
    {
      descripcion: 'Lote de micas de privacidad',
      monto: 1200,
      fecha: '2026-02-05',
      categoryName: 'repuestos',
    },
    {
      descripcion: 'Venta iPhone 11 128GB',
      monto: 4500,
      fecha: '2026-02-10',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Cena San Valentín',
      monto: 1800,
      fecha: '2026-02-14',
      categoryName: 'viajes y/o salidas',
    },
    {
      descripcion: 'Quincena 1 Febrero',
      monto: 6000,
      fecha: '2026-02-15',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Publicidad Facebook (Promo San Valentín)',
      monto: 500,
      fecha: '2026-02-16',
      categoryName: 'publicidad',
    },
    {
      descripcion: 'Pago de Luz Taller',
      monto: 450,
      fecha: '2026-02-18',
      categoryName: 'pago de luz',
    },
    {
      descripcion: 'Papas y Refresco taller',
      monto: 85,
      fecha: '2026-02-20',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Reparación de placa iPhone 13',
      monto: 3200,
      fecha: '2026-02-22',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Videojuego en Steam',
      monto: 650,
      fecha: '2026-02-25',
      categoryName: 'ocio',
    },
    {
      descripcion: 'Pago de Agua',
      monto: 150,
      fecha: '2026-02-28',
      categoryName: 'pago de agua',
    },

    // --- MARZO 2026 (Mes Actual - Basado en tus capturas) ---
    {
      descripcion: 'Renta Local Marzo',
      monto: 3500,
      fecha: '2026-03-01',
      categoryName: 'renta local',
    },
    {
      descripcion: 'Pantallas LCD varias (Inventario)',
      monto: 2800,
      fecha: '2026-03-05',
      categoryName: 'repuestos',
    },
    {
      descripcion: 'Curso NestJS Avanzado',
      monto: 450,
      fecha: '2026-03-08',
      categoryName: 'educacion',
    },
    {
      descripcion: 'Venta de fundas y cables',
      monto: 950,
      fecha: '2026-03-12',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Quincena 1 Marzo',
      monto: 6000,
      fecha: '2026-03-15',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Envío de equipo a cliente (Dhl)',
      monto: 220,
      fecha: '2026-03-17',
      categoryName: 'mensajeria',
    },
    {
      descripcion: 'Chequeo Médico General',
      monto: 1200,
      fecha: '2026-03-18',
      categoryName: 'salud',
    },
    {
      descripcion: '3 Cocas de 5 litros',
      monto: 500,
      fecha: '2026-03-20',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Takis fuego Bolsa grande',
      monto: 56,
      fecha: '2026-03-20',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Salida al Cine con amigos',
      monto: 600,
      fecha: '2026-03-22',
      categoryName: 'viajes y/o salidas',
    },
    {
      descripcion: 'Súper de la semana',
      monto: 1500,
      fecha: '2026-03-23',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Inversión en Cetes',
      monto: 1000,
      fecha: '2026-03-24',
      categoryName: 'inversiones',
    },
  ],
};
