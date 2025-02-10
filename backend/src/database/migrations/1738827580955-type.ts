import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Type1738827580955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'types',
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

    await queryRunner.query(`
        INSERT INTO types (id, name, is_active, created_at, updated_at, is_deleted) VALUES
        (NEWID(), N'Type 1', 1, GETDATE(), GETDATE(), 0),
        (NEWID(), N'Type 2', 1, GETDATE(), GETDATE(), 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('types');
  }
}
