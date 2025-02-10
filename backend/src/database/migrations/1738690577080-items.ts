import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Items1738690577080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'items',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'money',
            isNullable: true,
          },

          {
            name: 'is_active',
            type: 'bit',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'GETDATE()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'GETDATE()',
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'nvarchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'is_deleted',
            type: 'bit',
            default: 0,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'nvarchar',
            length: '250',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('items');
  }
}
