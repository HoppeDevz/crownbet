import { Entity, Column, PrimaryColumn } from 'typeorm';


@Entity("users_balance")
class Balance {

    @PrimaryColumn()
    user_id: number;

    @Column()
    balance: number;
}

export default Balance;