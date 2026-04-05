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
      password: 'Password123',
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
    { nombre: 'renta vivienda', tipo: TipoMovimiento.GASTO },
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

  // ==========================================
  // SEED_DATA ACTUALIZADO (MAYORES INGRESOS)
  // ==========================================

  expenses: [
    // ==========================================
    // MARZO 2026 (50 Registros - Gran mes de ventas)
    // ==========================================
    {
      descripcion: 'Sueldo Quincena 1 NestJS Dev',
      monto: 12500,
      fecha: '2026-03-15',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Sueldo Quincena 2 NestJS Dev',
      monto: 12500,
      fecha: '2026-03-30',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Venta iPhone 14 Pro Max Reacondicionado',
      monto: 18500,
      fecha: '2026-03-05',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Venta MacBook Pro M1 (Cliente Taller)',
      monto: 22000,
      fecha: '2026-03-20',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Proyecto Freelance API NestJS (Pago Final)',
      monto: 15000,
      fecha: '2026-03-10',
      categoryName: 'otros ingresos',
    },
    {
      descripcion: 'Reparación de Placa Base iPhone 13 (CPU)',
      monto: 4500,
      fecha: '2026-03-02',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Cambio Pantalla Original S23 Ultra',
      monto: 6500,
      fecha: '2026-03-03',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Lote Accesorios Premium',
      monto: 3500,
      fecha: '2026-03-04',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Recuperación de datos SSD Dañado',
      monto: 2800,
      fecha: '2026-03-06',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Samsung Galaxy A54',
      monto: 5500,
      fecha: '2026-03-07',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Servicio Mantenimiento Servidores (Mensual)',
      monto: 4000,
      fecha: '2026-03-08',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta AirPods Pro Gen 2',
      monto: 4200,
      fecha: '2026-03-09',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Reparación Conector Carga iPad Pro',
      monto: 1800,
      fecha: '2026-03-11',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Fundas y Micas (Semanal)',
      monto: 2500,
      fecha: '2026-03-12',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Desbloqueo Cuenta Google (Lote 5 equipos)',
      monto: 3000,
      fecha: '2026-03-13',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Renta Local Marzo',
      monto: 3500,
      fecha: '2026-03-01',
      categoryName: 'renta vivienda',
    },
    {
      descripcion: 'Súper mensual Walmart',
      monto: 2200,
      fecha: '2026-03-01',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Gasolina semanal',
      monto: 350,
      fecha: '2026-03-03',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Pantallas Inventario (Inversión)',
      monto: 4800,
      fecha: '2026-03-05',
      categoryName: 'repuestos',
    },
    {
      descripcion: 'Suscripciones (Netflix/Spotify/YT)',
      monto: 550,
      fecha: '2026-03-06',
      categoryName: 'suscripciones',
    },
    {
      descripcion: 'Comida en Taller (Semana 1)',
      monto: 600,
      fecha: '2026-03-07',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Herramientas Precision (iFixit)',
      monto: 1200,
      fecha: '2026-03-10',
      categoryName: 'herramientas',
    },
    {
      descripcion: 'Internet y Telefonia Taller',
      monto: 599,
      fecha: '2026-03-12',
      categoryName: 'internet y telefonia',
    },
    {
      descripcion: 'Cena Restaurante con amigos',
      monto: 1200,
      fecha: '2026-03-14',
      categoryName: 'viajes y/o salidas',
    },
    {
      descripcion: 'Venta Pantalla iPhone 11',
      monto: 1500,
      fecha: '2026-03-16',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Reparación Software Xiaomi (Brick)',
      monto: 800,
      fecha: '2026-03-17',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Pago Publicidad FB Ads',
      monto: 800,
      fecha: '2026-03-18',
      categoryName: 'publicidad',
    },
    {
      descripcion: 'Gasolina semanal',
      monto: 350,
      fecha: '2026-03-19',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Takis y refresco (Antojo)',
      monto: 85,
      fecha: '2026-03-20',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Inversión Cetes Directo',
      monto: 5000,
      fecha: '2026-03-21',
      categoryName: 'inversiones',
    },
    {
      descripcion: 'Venta Cargadores Carga Rápida (10)',
      monto: 3500,
      fecha: '2026-03-22',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Reparación Face ID iPhone 12',
      monto: 2200,
      fecha: '2026-03-23',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Comida corrida semana 3',
      monto: 550,
      fecha: '2026-03-24',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Venta Google Pixel 7 Pro',
      monto: 9500,
      fecha: '2026-03-25',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Mensajería repuestos urgentes',
      monto: 300,
      fecha: '2026-03-25',
      categoryName: 'mensajeria',
    },
    {
      descripcion: 'Pago de Luz Taller',
      monto: 650,
      fecha: '2026-03-26',
      categoryName: 'pago de luz',
    },
    {
      descripcion: 'Salida al Cine VIP',
      monto: 600,
      fecha: '2026-03-27',
      categoryName: 'ocio',
    },
    {
      descripcion: 'Venta Smartwatch Huawei',
      monto: 2800,
      fecha: '2026-03-28',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Gasolina semanal',
      monto: 350,
      fecha: '2026-03-29',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Súper rápido (Fruta/Leche)',
      monto: 450,
      fecha: '2026-03-30',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Reparación Nintendo Switch (Joycons)',
      monto: 1200,
      fecha: '2026-03-31',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Micas Mate (15 unidades)',
      monto: 2250,
      fecha: '2026-03-31',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Inversión Dividendos Acciones',
      monto: 1500,
      fecha: '2026-03-31',
      categoryName: 'inversiones',
    },
    {
      descripcion: 'Pago de Agua',
      monto: 180,
      fecha: '2026-03-31',
      categoryName: 'pago de agua',
    },
    {
      descripcion: 'Compra cautín JBC (Upgrade)',
      monto: 3800,
      fecha: '2026-03-15',
      categoryName: 'herramientas',
    },
    {
      descripcion: 'Reparación Apple Watch (Batería)',
      monto: 1400,
      fecha: '2026-03-14',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Kindle Paperwhite',
      monto: 2500,
      fecha: '2026-03-18',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Curso Frontend Masters (Anual)',
      monto: 2500,
      fecha: '2026-03-10',
      categoryName: 'educacion',
    },
    {
      descripcion: 'Reparación Puerto HDMI PS5',
      monto: 1900,
      fecha: '2026-03-22',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta Mouse Gamer Logitech',
      monto: 1100,
      fecha: '2026-03-26',
      categoryName: 'venta productos',
    },

    // ==========================================
    // ABRIL 2026 (25 Registros - Balance Positivo)
    // ==========================================
    {
      descripcion: 'Sueldo Quincena 1 Abril',
      monto: 12500,
      fecha: '2026-04-01',
      categoryName: 'sueldo fijo',
    },
    {
      descripcion: 'Renta Local Abril',
      monto: 3500,
      fecha: '2026-04-01',
      categoryName: 'renta vivienda',
    },
    {
      descripcion: 'Venta Lote Celulares para piezas',
      monto: 8000,
      fecha: '2026-04-01',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Súper despensa Abril',
      monto: 2400,
      fecha: '2026-04-01',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Reparación Urgente iPhone 15 Pro Max',
      monto: 5500,
      fecha: '2026-04-02',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Internet Abril',
      monto: 599,
      fecha: '2026-04-01',
      categoryName: 'internet y telefonia',
    },
    {
      descripcion: 'Venta Monitor 4K (Usado)',
      monto: 4500,
      fecha: '2026-04-02',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Gasolina Moto',
      monto: 350,
      fecha: '2026-04-02',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Compra Lote Pantallas iPhone 12/13',
      monto: 7500,
      fecha: '2026-04-02',
      categoryName: 'repuestos',
    },
    {
      descripcion: 'Reparación Laptop HP (Bisagras)',
      monto: 1600,
      fecha: '2026-04-02',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta 10 fundas silicon',
      monto: 1800,
      fecha: '2026-04-02',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Inversión Crypto (ETH)',
      monto: 1000,
      fecha: '2026-04-02',
      categoryName: 'inversiones',
    },
    {
      descripcion: 'Servicio Web App Cliente Local',
      monto: 6500,
      fecha: '2026-04-03',
      categoryName: 'otros ingresos',
    },
    {
      descripcion: 'Publicidad Instagram (Campaña Abril)',
      monto: 1000,
      fecha: '2026-04-03',
      categoryName: 'publicidad',
    },
    {
      descripcion: 'Venta de iPad Air 4',
      monto: 8500,
      fecha: '2026-04-03',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Reparación Cámara Samsung S22',
      monto: 2100,
      fecha: '2026-04-03',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Comida Familiar Sábado',
      monto: 1500,
      fecha: '2026-04-04',
      categoryName: 'alimentacion',
    },
    {
      descripcion: 'Venta Repetidores WiFi (5)',
      monto: 3000,
      fecha: '2026-04-04',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Cambio de Glass Apple Watch S7',
      monto: 2500,
      fecha: '2026-04-04',
      categoryName: 'servicios reparacion',
    },
    {
      descripcion: 'Venta GoPro Hero 9',
      monto: 4800,
      fecha: '2026-04-04',
      categoryName: 'venta productos',
    },
    {
      descripcion: 'Mensajería DHL envío CDMX',
      monto: 280,
      fecha: '2026-04-03',
      categoryName: 'mensajeria',
    },
    {
      descripcion: 'Gasolina extra fin de semana',
      monto: 200,
      fecha: '2026-04-04',
      categoryName: 'transporte y/o gasolina',
    },
    {
      descripcion: 'Antojos y Bebidas Taller',
      monto: 120,
      fecha: '2026-04-04',
      categoryName: 'gastos hormiga',
    },
    {
      descripcion: 'Suscripción Copilot AI',
      monto: 200,
      fecha: '2026-04-03',
      categoryName: 'suscripciones',
    },
    {
      descripcion: 'Venta Bocina JBL Flip 6',
      monto: 2100,
      fecha: '2026-04-04',
      categoryName: 'venta productos',
    },
  ],
};
