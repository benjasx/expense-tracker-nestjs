import { IsString, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { TipoMovimiento } from '../entities/categoria.entity';
import { Transform } from 'class-transformer';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsEnum(TipoMovimiento, { message: 'El tipo debe ser ingreso o gasto' })
  @Transform(({ value }) => value.trim().toLowerCase())
  tipo: TipoMovimiento;
}
