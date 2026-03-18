import { Categoria } from 'src/categorias/entities/categoria.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  descripcion: string;

  @Column('float', { default: 0 })
  monto: number;

  @Column({ type: 'date' })
  fecha: string;

  @CreateDateColumn()
  createdAt: Date;

  // RELACIÓN: Muchos gastos pertenecen a una categoría
  @ManyToOne(
    () => Categoria,
    (categoria) => categoria.gastos,
    { onDelete: 'CASCADE' }, // Si borras la categoría, se borran sus gastos (opcional)
  )
  categoria: Categoria;
}
