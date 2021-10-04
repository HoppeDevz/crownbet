import { createConnection } from 'typeorm';

class Database {

    public createConnection() {

        createConnection();
    }
}

export default new Database();