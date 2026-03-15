import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: string;

  @BeforeInsert()
  @BeforeUpdate()
  checkFormat() {
    if (this.nombre) {
      this.nombre = this.nombre.trim().toLowerCase();
    }
  }
}
