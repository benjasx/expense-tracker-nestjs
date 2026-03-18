import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  MinLength,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'La descripción es muy corta' })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @IsDateString(
    {},
    { message: 'La fecha debe ser un formato válido (ISO 8601)' },
  )
  @IsNotEmpty()
  fecha: string; // El usuario mandará "2026-03-20"

  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  @IsNotEmpty()
  categoriaId: string; // <-- Este es el "vínculo" con la otra tabla
}
