import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ItemsTypesEntity } from '../entities/item-type.entity';
import { ItemsCategoriesEntity } from '../entities/item-category.entity';
import { getCdn } from 'src/helper';
import { randomUUID } from 'crypto';

export class TypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class CategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class FileDto {
  @Expose()
  id: string;

  @Expose()
  itemId: string;

  @Expose()
  fileName: string;

  @Expose()
  @Transform(({ value }) => {
    if (value) {
      return getCdn(value);
    }
  })
  path: string;

  @Expose()
  originalName: string;

  @Expose()
  @Type(() => Number)
  size: number;

  @Expose()
  mimeType: string;

  @Expose()
  ext: string;
}

export class ItemCategoryDto {
  @Expose()
  id: string;

  @Expose()
  categoryId: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;
}

export class ItemTypeDto {
  @Expose()
  id: string;

  @Expose()
  typeId: string;

  @Expose()
  @Type(() => TypeDto)
  type: TypeDto;
}

export class DetailItemDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose({ name: 'itemTypes' })
  @Type(() => ItemTypeDto)
  @Transform(({ value }) => {
    return value?.map((p) => p?.typeId);
  })
  types: ItemTypeDto[];

  @Expose({ name: 'itemCategories' })
  @Type(() => ItemCategoryDto)
  @Transform(({ value }) => {
    return value?.map((p) => p?.categoryId);
  })
  categories: ItemCategoryDto[];

  @Expose({ name: 'itemFiles' })
  @Type(() => FileDto)
  @Transform(({ value }) => {
    if (value?.length) {
      return value?.map((p) => {
        return {
          uid: randomUUID(),
          name: p?.originalName,
          status: 'done',
          thumbUrl: p?.path,
          response: {
            id: p?.id,
            fileName: p?.fileName,
            originalName: p?.originalName,
            size: p?.size,
            mimeType: p?.mimeType,
            ext: p?.ext,
            itemId: p?.itemId,
            path: p?.path
          },
        };
      });
    }
  })
  images: FileDto[];
}
