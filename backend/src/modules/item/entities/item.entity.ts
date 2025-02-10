import { Exclude } from 'class-transformer';
import { CategoryEntity } from '../../category/entities/category.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemsTypesEntity } from './item-type.entity';
import { ItemsCategoriesEntity } from './item-category.entity';
import { ItemsFilesEntity } from './item-files.entity';

@Entity('items')
export class ItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 250, nullable: false })
  name: string;

  @Column({ name: 'price', type: 'money', nullable: true })
  price: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @Column({ name: 'updated_at' })
  updatedAt?: Date;

  @Exclude()
  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Exclude()
  @Column({ name: 'deleted_at' })
  deletedAt: Date;

  @Exclude()
  @Column({ name: 'deleted_by' })
  deletedBy: string;

  @OneToMany(() => ItemsTypesEntity, (itemTypeMapping) => itemTypeMapping.item)
  itemTypes: ItemsTypesEntity[];

  @OneToMany(() => ItemsCategoriesEntity, (itemCateMapping) => itemCateMapping.item)
  itemCategories: ItemsCategoriesEntity[];

  @OneToMany(() => ItemsFilesEntity, (f) => f.item)
  itemFiles: ItemsFilesEntity[];
}
