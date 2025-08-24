import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

import Token from "~/database/token.entity";
import Role from "~/database/role.entity";
import Announcement from "~/database/announcement.entity";
import Book from "~/database/book.entity";
import Conflict from "~/database/conflict.entity";
import New from "~/database/new.entity";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "longblob", nullable: true, default: null, select: false })
    photo!: Buffer;

    @Column({ nullable: false })
    name!: string;

    @Column({ default: null })
    biography!: string;

    @Column({ type: "varchar", unique: true, select: false, nullable: false })
    email!: string;

    @Column({ type: "varchar", select: false, nullable: false })
    password!: string;

    @OneToMany(() => Token, token => token.user)
    tokens!: Token[];

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    @JoinColumn({ name: "roleId" })
    role!: Role;

    @Column({ default: 4, select: false })
    roleId!: number;

    @OneToMany(() => Announcement, announcement => announcement.user)
    announcements!: Announcement[];

    @OneToMany(() => Book, book => book.user)
    books!: Book[];

    @OneToMany(() => Conflict, conflict => conflict.user)
    conflicts!: Conflict[];

    @OneToMany(() => New, news => news.user)
    news!: New[];
}
