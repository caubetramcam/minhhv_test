import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemsEntity } from './item.entity';
import { TypeEntity } from '../../type/entities/type.entity';

@Entity('items_types')
export class ItemsTypesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'type_id', type: 'uniqueidentifier' })
  typeId: string;

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

  @ManyToOne(() => ItemsEntity, (item) => item.itemTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: ItemsEntity;

  @ManyToOne(() => TypeEntity, (type) => type.itemTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'type_id' })
  type: TypeEntity;
}
