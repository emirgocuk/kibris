import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import User from "~/database/user.entity";

@Entity()
export default class New {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false, select: false })
    slug!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "longblob", nullable: true, select: false })
    cover!: Buffer

    @Column({ type: "longtext", nullable: false })
    content!: string;

    @Column({ default: false })
    isApproved!: boolean;

    @ManyToOne(() => User, user => user.news, { nullable: false })
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
