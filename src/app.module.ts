import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CategoriasModule],
})
export class AppModule {}
