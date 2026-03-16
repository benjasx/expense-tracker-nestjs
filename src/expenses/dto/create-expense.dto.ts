import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  MinLength,
  IsNotEmpty,
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

  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  @IsNotEmpty()
  categoriaId: string; // <-- Este es el "vínculo" con la otra tabla
}
