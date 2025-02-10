import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemsEntity } from './item.entity';
import { Transform } from 'class-transformer';
import { getCdn } from '../../../helper';

@Entity('items_files')
export class ItemsFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_id', type: 'uniqueidentifier' })
  itemId: string;

  @Column({ name: 'file_name', length: 250, type: 'nvarchar' })
  fileName: string;

  @Column({ name: 'original_name', length: 250, type: 'nvarchar' })
  originalName: string;

  @Column({ name: 'path', length: 250, type: 'nvarchar' })
  @Transform(({ value }) => getCdn(value))
  path: string;

  @Column({ name: 'size', type: 'bigint' })
  size: number;

  @Column({ name: 'mime_type', length: 100, type: 'varchar' })
  mimeType: string;

  @Column({ name: 'ext', length: 50, type: 'varchar' })
  ext: string;

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
  
  @ManyToOne(() => ItemsEntity, (item) => item.itemFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: ItemsEntity;
}
