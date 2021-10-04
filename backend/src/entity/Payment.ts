import { Entity, Column, PrimaryColumn } from 'typeorm';


@Entity("payments")
class Payment {

    @PrimaryColumn()
    id: number;

    @Column()
    order_id: string;

    @Column()
    payment: string;

    @Column()
    created_at: Date;
}

export default Payment;