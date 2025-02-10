import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1738812868467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'username',
            type: 'nvarchar',
            length: '250',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'nvarchar',
            length: '250',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'nvarchar',
            length: '250',
            isNullable: false,
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
    //pass:admin@123
    await queryRunner.query(`
        INSERT INTO users (id, username, password, full_name, is_active, created_at, updated_at, is_deleted) VALUES
        (NEWID(), N'admin', '$2a$12$IfJ8NZNY7T6KhGVOF4Ieh.k2j4K.6erving9EC59rImz9EVUfYqF2', N'Administrator', 1, GETDATE(), GETDATE(), 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
