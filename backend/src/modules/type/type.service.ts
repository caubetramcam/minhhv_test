import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeEntity } from './entities/type.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(TypeEntity)
    private readonly typeRepo: Repository<TypeEntity>,
  ) {}

  async findAll(): Promise<TypeEntity[]> {
    const types = await this.typeRepo.find();
    return types;
  }

  async findByIds(ids: string[]): Promise<TypeEntity[]> {
    if (!ids?.length) return [];
    return this.typeRepo.find({
      where: {
        id: In(ids),
        isDeleted: false,
        isActive: true,
      },
    });
  }
}
