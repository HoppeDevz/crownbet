import mysql, { Pool } from 'mysql';

import config from '../config';

class Database {

    connection: Pool;

    constructor() {

        this.connection = mysql.createPool({
            localAddress: config.DB_ADRESS,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME
        });
    }
}

export default new Database();