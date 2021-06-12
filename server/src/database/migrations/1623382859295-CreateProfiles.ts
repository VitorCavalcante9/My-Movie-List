import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProfiles1623382859295 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "profiles",
      columns: [
        {
          name: "id",
          type: "integer",
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "user_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "number",
          type: "integer"
        },
        {
          name: "name",
          type: "varchar"
        }
      ],
      foreignKeys: [
        {
          name: "profile_fk",
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          columnNames: ["user_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("profiles");
  }

}
