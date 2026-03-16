import { Expense } from 'src/expenses/entities/expense.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Expense, (expense) => expense.categoria)
  gastos: Expense[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFormat() {
    if (this.nombre) {
      this.nombre = this.nombre.trim().toLowerCase();
    }
  }
}
