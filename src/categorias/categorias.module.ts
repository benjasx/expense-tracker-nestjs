import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [TypeOrmModule.forFeature([Categoria]), AuthModule],
})
export class CategoriasModule {}
