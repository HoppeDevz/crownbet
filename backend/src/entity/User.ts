import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users_accounts')
class User {

    @PrimaryColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    balance: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}

export default User;