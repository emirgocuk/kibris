import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import User from "~/database/user.entity"

@Entity()
export default class Token {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    token!: string;

    @ManyToOne(() => User, user => user.tokens, { onDelete: "CASCADE" })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

}
