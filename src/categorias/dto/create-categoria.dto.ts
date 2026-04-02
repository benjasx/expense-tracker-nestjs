import { IsString, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimiento } from '../entities/categoria.entity';
import { Transform } from 'class-transformer';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nombre único de la categoría',
    example: 'Servicios de Internet',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Clasificación de la categoría',
    enum: TipoMovimiento,
    example: TipoMovimiento.GASTO,
  })
  @IsEnum(TipoMovimiento, { message: 'El tipo debe ser ingreso o gasto' })
  @Transform(({ value }) => value.trim().toLowerCase())
  tipo: TipoMovimiento;
}
