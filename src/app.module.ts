import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesModule } from './expenses/expenses.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoriasModule,

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.BD_NAME,
      autoLoadEntities: true, // Carga automáticamente los archivos .entity.ts
      synchronize: true, // Crea las tablas en Docker automáticamente al guardar
    }),

    ExpensesModule,

    SeedModule,

    AuthModule,

    ReportsModule,

    PrinterModule,
  ],
})
export class AppModule {}
