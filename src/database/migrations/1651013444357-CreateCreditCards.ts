import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCreditCards1651013444357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_cards',
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
            name: 'closing_day',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'brand_id',
            type: 'varchar',
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
      'credit_cards',
      new TableForeignKey({
        name: 'fk_credit_card_brand',
        columnNames: ['brand_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'credit_card_brand',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('credit_cards', 'fk_credit_card_brand');
    await queryRunner.dropTable('credit_cards');
  }
}
