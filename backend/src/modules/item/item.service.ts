import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsEntity } from './entities/item.entity';
import { Brackets, DataSource, In, Not, Repository } from 'typeorm';
import { ItemsTypesEntity } from './entities/item-type.entity';
import { ItemsCategoriesEntity } from './entities/item-category.entity';
import { QueryItemDto } from './dto/query-item.dto';
import { plainToInstance } from 'class-transformer';
import { DetailItemDto } from './dto/detail-item.dto';
import { ListItemDto } from './dto/list-item.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsFilesEntity } from './entities/item-files.entity';
import { CategoryService } from '@app/category/category,service';
import { TypeService } from '@app/type/type.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsEntity)
    private readonly itemRepo: Repository<ItemsEntity>,
    @InjectRepository(ItemsTypesEntity)
    private readonly itemTypeRepo: Repository<ItemsTypesEntity>,
    @InjectRepository(ItemsCategoriesEntity)
    private readonly itemCateRepo: Repository<ItemsCategoriesEntity>,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService,
    private readonly typeService: TypeService,
  ) {}

  async findAll(query: QueryItemDto) {
    const qb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect(
        'item.itemTypes',
        'itemTypes',
        'itemTypes.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'item.itemCategories',
        'itemCategories',
        'itemCategories.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'item.itemFiles',
        'itemFiles',
        'itemFiles.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect('itemTypes.type', 'type')
      .leftJoinAndSelect('itemCategories.category', 'category')
      .where('item.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('item.isActive = :isActive', { isActive: true });

    if (query?.keyword && query?.keyword?.trim() !== '') {
      const keyword = query?.keyword.toString();
      qb.andWhere(
        new Brackets((qb) =>
          qb.where('item.name LIKE :name', {
            name: `%${keyword}%`,
          }),
        ),
      );
    }

    if (query?.sort) {
      let [sortKey, sortDirection] = query.sort.split(':');
      if (!['ASC', 'DESC'].includes(sortDirection.toUpperCase())) {
        sortDirection = 'DESC';
      }
      qb.orderBy(`item.${sortKey}`, sortDirection.toUpperCase() as any);
    } else {
      qb.orderBy(`item.createdAt`, 'DESC');
    }
    qb.take(query?.size);
    qb.skip((query?.page - 1) * query?.size);
    const [data, total] = await qb.getManyAndCount();
    return {
      total,
      data: plainToInstance(ListItemDto, data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async delete(id: string, user: string) {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) {
      throw new Error('Item not found');
    }
    await this.itemRepo.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user,
    });
    return true;
  }

  async findOne(id: string) {
    const qb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect(
        'item.itemTypes',
        'itemTypes',
        'itemTypes.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'item.itemCategories',
        'itemCategories',
        'itemCategories.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'item.itemFiles',
        'itemFiles',
        'itemFiles.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect('itemTypes.type', 'type')
      .leftJoinAndSelect('itemCategories.category', 'category')
      .where('item.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('item.isActive = :isActive', { isActive: true })
      .andWhere('item.id = :id', { id });

    const item = await qb.getOne();

    if (!item) {
      throw new Error('Item not found');
    }
    return plainToInstance(DetailItemDto, item, {
      excludeExtraneousValues: true,
    });
  }

  async create(payload: CreateItemDto, user: string) {
    const _types = await this.typeService.findByIds(payload?.types);
    const _categories = await this.categoryService.findByIds(
      payload?.categories,
    );

    return await this.dataSource.transaction(async (manager) => {
      const itemSave = await manager.getRepository(ItemsEntity).save(
        manager.create(ItemsEntity, {
          name: payload?.name,
          price: payload?.price,
          createdAt: new Date(),
          createdBy: user,
          isActive: true,
          isDeleted: false,
        }),
      );

      if (_types?.length) {
        await manager.getRepository(ItemsTypesEntity).save(
          _types.map((type) => {
            return manager.create(ItemsTypesEntity, {
              typeId: type?.id,
              itemId: itemSave?.id,
              createdAt: new Date(),
              createdBy: user,
              isDeleted: false,
            });
          }),
        );
      }
      if (_categories?.length) {
        await manager.getRepository(ItemsCategoriesEntity).save(
          _categories.map((category) => {
            return manager.create(ItemsCategoriesEntity, {
              categoryId: category?.id,
              itemId: itemSave?.id,
              createdAt: new Date(),
              createdBy: user,
              isDeleted: false,
            });
          }),
        );
      }
      if (payload?.images?.length) {
        await manager.getRepository(ItemsFilesEntity).save(
          payload?.images.map((img) => {
            return manager.create(ItemsFilesEntity, {
              itemId: itemSave?.id,
              fileName: img?.fileName,
              path: img?.path,
              originalName: img?.originalName,
              mimeType: img?.mimeType,
              ext: img?.ext,
              size: img?.size,
              createdAt: new Date(),
              createdBy: user,
              isDeleted: false,
            });
          }),
        );
      }
      return itemSave;
    });
  }

  async update(id: string, payload: UpdateItemDto, user: string) {
    const _types = await this.typeService.findByIds(payload?.types);
    const _categories = await this.categoryService.findByIds(
      payload?.categories,
    );

    return await this.dataSource.transaction(async (manager) => {
      const item = await manager.getRepository(ItemsEntity).findOneBy({ id });
      if (!item) {
        throw new Error('Item not found');
      }

      await manager.getRepository(ItemsEntity).update(id, {
        name: payload?.name,
        price: payload?.price,
        updatedAt: new Date(),
        updatedBy: user,
      });

      const _typesDB = await manager
        .getRepository(ItemsTypesEntity)
        .findBy({ itemId: id, isDeleted: false });

      if (_types?.length) {
        const _typesDel = _typesDB?.filter(
          (p) => !_types?.some((k) => k?.id == p?.typeId),
        );
        const _typesIns = _types?.filter(
          (p) => !_typesDB?.some((k) => k?.typeId == p?.id),
        );

        if (_typesDel?.length) {
          await manager.getRepository(ItemsTypesEntity).update(
            {
              itemId: id,
              id: In(_typesDel.map((p) => p?.id)),
              isDeleted: false,
            },
            {
              isDeleted: true,
              deletedAt: new Date(),
              deletedBy: user,
            },
          );
        }

        if (_typesIns?.length) {
          await manager.getRepository(ItemsTypesEntity).save(
            _typesIns?.map((type) => {
              return manager.create(ItemsTypesEntity, {
                typeId: type?.id,
                itemId: id,
                createdAt: new Date(),
                createdBy: user,
                isDeleted: false,
              });
            }),
          );
        }
      } else {
        await manager.getRepository(ItemsTypesEntity).update(
          {
            itemId: id,
          },
          {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: user,
          },
        );
      }

      const _categoriesDB = await manager
        .getRepository(ItemsCategoriesEntity)
        .findBy({ itemId: id, isDeleted: false });

      if (_categories?.length) {
        const _categoriesDel = _categoriesDB?.filter(
          (p) => !_categories?.some((k) => k?.id == p?.categoryId),
        );
        const _categoriesIns = _categories?.filter(
          (p) => !_categoriesDB?.some((k) => k?.categoryId == p?.id),
        );

        if (_categoriesDel?.length) {
          await manager.getRepository(ItemsCategoriesEntity).update(
            {
              itemId: id,
              id: In(_categoriesDel.map((p) => p?.id)),
              isDeleted: false,
            },
            {
              isDeleted: true,
              deletedAt: new Date(),
              deletedBy: user,
            },
          );
        }

        if (_categoriesIns?.length) {
          await manager.getRepository(ItemsCategoriesEntity).save(
            _categoriesIns.map((category) => {
              return manager.create(ItemsCategoriesEntity, {
                categoryId: category?.id,
                itemId: id,
                createdAt: new Date(),
                createdBy: user,
                isDeleted: false,
              });
            }),
          );
        }
      } else {
        await manager.getRepository(ItemsCategoriesEntity).update(
          {
            itemId: id,
          },
          {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: user,
          },
        );
      }

      if (payload?.images?.length) {
        const _files = await manager.getRepository(ItemsFilesEntity).find({
          where: {
            itemId: id,
            isDeleted: false,
          },
        });

        const _filesDel = _files?.filter(
          (p) => !payload?.images?.some((l) => l.id == p?.id),
        );

        //Delete
        if (_filesDel?.length) {
          await manager.getRepository(ItemsFilesEntity).update(
            {
              itemId: id,
              isDeleted: false,
              id: In(_filesDel?.map((p) => p?.id)),
            },
            {
              isDeleted: true,
              deletedAt: new Date(),
              deletedBy: user,
            },
          );
        }
        const _filesIns = payload?.images?.filter((p) => !p?.id);
        if (_filesIns?.length) {
          await manager.getRepository(ItemsFilesEntity).save(
            _filesIns.map((img) => {
              return manager.create(ItemsFilesEntity, {
                itemId: id,
                fileName: img?.fileName,
                path: img?.path,
                originalName: img?.originalName,
                mimeType: img?.mimeType,
                ext: img?.ext,
                size: img?.size,
                createdAt: new Date(),
                createdBy: user,
                isDeleted: false,
              });
            }),
          );
        }
      } else {
        await manager.getRepository(ItemsFilesEntity).delete({
          itemId: id,
        });
      }
      return item;
    });
  }
}
