import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResultCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  async findOne(id: string): Promise<CategoryEntity> {
    return this.categoryRepo.findOneBy({ id });
  }

  async findByIds(ids: string[]): Promise<CategoryEntity[]> {
    if(!ids?.length) return [];
    return this.categoryRepo.find({
      where: {
        id: In(ids),
        isDeleted: false,
        isActive: true,
      },
    });
  }
}
