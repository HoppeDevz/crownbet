import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1633140322219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("CREATE DATABASE IF NOT EXISTS crownbet");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("DROP DATABASE crownbet");
    }

}
