import { Expose, Transform, Type } from 'class-transformer';
import { FileDto, ItemCategoryDto, ItemTypeDto } from './detail-item.dto';

export class ListItemDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose({ name: 'itemTypes' })
  @Type(() => ItemTypeDto)
  @Transform(({ value }) => {
    return value?.map((p) => {
        return {
            id: p?.typeId,
            name: p?.type?.name
        }
    });
  })
  types: ItemTypeDto[];

  @Expose({ name: 'itemCategories' })
  @Type(() => ItemCategoryDto)
  @Transform(({ value }) => {
    return value?.map((p) => {
        return {
            id: p?.categoryId,
            name: p?.category?.name
        }
    });
  })
  categories: ItemCategoryDto[];

  @Expose({name: 'itemFiles'})
  @Type(() => FileDto)
  images: FileDto[]
}
