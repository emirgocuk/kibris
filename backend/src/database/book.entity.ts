import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import User from "~/database/user.entity";

@Entity()
export default class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false, select: false })
    slug!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "varchar" })
    author!: string;

    @Column({ type: "longblob", nullable: true, select: false })
    cover!: Buffer

    @Column({ type: "longtext", nullable: false })
    content!: string;

    @Column({ default: false })
    isApproved!: boolean;

    @ManyToOne(() => User, user => user.books, { nullable: false })
    user!: User;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
