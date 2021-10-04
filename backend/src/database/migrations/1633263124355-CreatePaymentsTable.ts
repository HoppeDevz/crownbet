import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePaymentsTable1633263124355 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id int(11) NOT NULL AUTO_INCREMENT,
                order_id varchar(255) NOT NULL,
                payment text NOT NULL,
                created_at date,
                PRIMARY KEY (id)
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DROP TABLE payments
        `)
    }

}
