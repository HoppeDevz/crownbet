import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsersTable1633140473029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users_accounts (
            id int(11) NOT NULL AUTO_INCREMENT,
            username varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(2056) NOT NULL,
            created_at DATE NOT NULL,
            updated_at DATE NOT NULL,
            PRIMARY KEY (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        queryRunner.query("DROP TABLE users_accounts");
    }

}
