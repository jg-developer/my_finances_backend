import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDebts1651102582006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'debts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observation',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'value',
            type: 'numeric',
            isNullable: false,
            scale: 2,
            precision: 8,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'installments',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'payment_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'debts',
      new TableForeignKey({
        name: 'fk_category',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('debts', 'fk_category');
    await queryRunner.dropTable('debts');
  }
}
