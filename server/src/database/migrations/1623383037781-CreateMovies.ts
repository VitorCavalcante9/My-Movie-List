import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMovies1623383037781 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "movies",
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
          name: "profile_id",
          type: "integer",
          unsigned: true
        },
        {
          name: "movie_id",
          type: "integer"
        },
        {
          name: "watched",
          type: "boolean"
        }
      ],
      foreignKeys: [
        {
          name: "movie_fk",
          referencedTableName: "profiles",
          referencedColumnNames: ["id"],
          columnNames: ["profile_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("movies");
  }

}
