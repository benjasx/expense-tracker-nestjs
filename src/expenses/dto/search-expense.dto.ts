// src/expenses/dto/search-expense.dto.ts
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
import { TipoMovimiento } from 'src/categorias/entities/categoria.entity';

export class SearchExpenseDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convierte "12" string a 12 number
  limit?: number = 12;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  minMonto?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TipoMovimiento)
  tipo?: TipoMovimiento; // Aquí recibiremos 'ingreso' o 'gasto'

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  maxMonto?: number; // Este será el límite máximo

  @IsOptional()
  @IsIn(['fecha', 'monto', 'descripcion', 'categoria'], {
    message: 'Solo puedes ordenar por: fecha, monto, descripcion o categoria',
  })
  sortBy?: string = 'fecha';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
    message: 'El orden debe ser ASC o DESC',
  })
  order?: 'ASC' | 'DESC' = 'DESC';
}
