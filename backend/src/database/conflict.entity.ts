import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "~/database/user.entity";

@Entity()
export default class Conflict {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    title!: string;

    @Column({ unique: true, nullable: false, select: false })
    slug!: string;

    @Column({ type: "longtext", nullable: false })
    content!: string;


    @Column({ default: false })
    isApproved!: boolean;

    @ManyToOne(() => User, user => user.conflicts, { nullable: false })
    user!: User;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
