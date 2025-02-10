import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsEntity } from './entities/item.entity';
import { ItemsTypesEntity } from './entities/item-type.entity';
import { ItemsCategoriesEntity } from './entities/item-category.entity';
import { ItemController } from './item.controller';
import { ItemsService } from './item.service';
import { ItemsFilesEntity } from './entities/item-files.entity';
import { CategoryModule } from '@app/category/category.module';
import { TypeModule } from '@app/type/type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsEntity,
      ItemsTypesEntity,
      ItemsCategoriesEntity,
      ItemsFilesEntity
    ]),
    CategoryModule,
    TypeModule
  ],
  controllers: [ItemController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
