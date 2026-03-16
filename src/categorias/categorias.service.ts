import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      if (error.code === '23505')
        throw new BadRequestException(
          'La categoría ya existe en la base de datos',
        );

      throw new InternalServerErrorException(
        'Error inesperado, revise los logs del servidor',
      );
    }
  }

  async findAll() {
    const products = await this.categoriaRepository.find();
    return products;
  }

  async findOne(term: string) {
    let categoria: Categoria | null;

    if (isUUID(term)) {
      categoria = await this.categoriaRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.categoriaRepository.createQueryBuilder('cat');
      categoria = await queryBuilder
        .where('UPPER(nombre) = :nombre', {
          nombre: term.toUpperCase().trim(),
        })
        .getOne();
    }

    if (!categoria) {
      throw new NotFoundException(
        `No se encontró categoría con el término: ${term}`,
      );
    }

    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto,
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con id: ${id} no encontrada`);
    }

    try {
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException('Ese nombre de categoría ya existe');

    console.log(error);
    throw new InternalServerErrorException('Error al actualizar la categoría');
  }

  async remove(id: string) {
    const categoria = await this.findOne(id);

    await this.categoriaRepository.remove(categoria);

    return {
      message: `La categoría "${categoria.nombre}" fue eliminada con éxito`,
    };
  }
}
