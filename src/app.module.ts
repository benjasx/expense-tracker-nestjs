import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesModule } from './expenses/expenses.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoriasModule,

    TypeOrmModule.forRoot({
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

    UsersModule,
  ],
})
export class AppModule {}
