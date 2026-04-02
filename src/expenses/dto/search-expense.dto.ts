import {
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsUUID,
  IsDateString,
  IsEnum,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger'; // 👈 Importación clave
import { TipoMovimiento } from 'src/categorias/entities/categoria.entity';

export class SearchExpenseDto {
  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    default: 12,
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 12;

  @ApiPropertyOptional({
    description: 'Número de registros a saltar',
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Término de búsqueda (descripción)',
    example: 'comida',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de categoría (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @ApiPropertyOptional({ description: 'Monto mínimo a filtrar', example: 100 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  minMonto?: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2026-03-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2026-03-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de movimiento',
    enum: TipoMovimiento, //Esto crea un dropdown en Swagger
    example: TipoMovimiento.GASTO,
  })
  @IsOptional()
  @IsEnum(TipoMovimiento)
  tipo?: TipoMovimiento;

  @ApiPropertyOptional({ description: 'Monto máximo a filtrar', example: 5000 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  maxMonto?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    enum: ['fecha', 'monto', 'descripcion', 'categoria'],
    default: 'fecha',
  })
  @IsOptional()
  @IsIn(['fecha', 'monto', 'descripcion', 'categoria'])
  sortBy?: string = 'fecha';

  @ApiPropertyOptional({
    description: 'Dirección del orden',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
