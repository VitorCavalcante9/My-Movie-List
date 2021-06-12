import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1623382390432 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        {
          name: "id",
          type: "varchar",
          isPrimary: true,
          generationStrategy: "uuid"
        },
        {
          name: "name",
          type: "varchar"
        },
        {
          name: "email",
          type: "varchar",
          isUnique: true
        },
        {
          name: "password",
          type: "varchar"
        },
        {
          name: "birth_date",
          type: "date"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }

}
