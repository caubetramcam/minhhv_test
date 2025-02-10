import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ name: 'username', length: 250, nullable: false })
  username: string;
  
  @Exclude()
  @Column({ name: 'password', length: 250, nullable: false })
  password: string;

  @Expose()
  @Column({ name: 'full_name', length: 250, nullable: false })
  fullName: string;
  
  @Exclude()
  @Column({ name: 'is_active' })
  isActive: boolean;

  @Exclude()
  @Column({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @Column({ name: 'created_by' })
  createdBy: string;

  @Exclude()
  @Column({ name: 'updated_by' })
  updatedBy: string;

  @Exclude()
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
}
