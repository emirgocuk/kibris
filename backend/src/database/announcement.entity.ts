import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import User from "~/database/user.entity";


@Entity()
export default class Announcement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    title!: string;

    @Column({ default: false })
    forAdmins!: boolean;

    @Column({ type: "longtext", nullable: false })
    content!: string;

    @ManyToOne(() => User, user => user.announcements, { nullable: false })
    user!: User;

    @Column()
    userId!: number;
}
