import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ItemCategories1738828753294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
          name: 'items_categories',
          columns: [
            {
              name: 'id',
              type: 'uniqueidentifier',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'NEWID()',
            },
            {
              name: 'category_id',
              type: 'uniqueidentifier',
              isNullable: true,
            },
            {
              name: 'item_id',
              type: 'uniqueidentifier',
              isNullable: true,
            },
            {
              name: 'created_at',
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
          // uniques: [
          //   {
          //     name: 'UQ_items_categories_category_item',
          //     columnNames: ['category_id', 'item_id'],
          //   },
          // ],
          foreignKeys: [
            {
              columnNames: ['category_id'],
              referencedTableName: 'categories',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
            {
              columnNames: ['item_id'],
              referencedTableName: 'items',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('items_categories');
  }
}
