import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemsEntity } from './item.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { Expose } from 'class-transformer';

@Entity('items_categories')
export class ItemsCategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ name: 'category_id', type: 'uniqueidentifier' })
  categoryId: string;

  @Column({ name: 'item_id', type: 'uniqueidentifier' })
  itemId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ name: 'deleted_by' })
  deletedBy: string;

  @ManyToOne(() => ItemsEntity, (item) => item.itemCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: ItemsEntity;

  @ManyToOne(() => CategoryEntity, (cate) => cate.itemCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
