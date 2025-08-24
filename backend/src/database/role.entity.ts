import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import User from "~/database/user.entity";

@Entity()
export default class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany(() => User, user => user.role)
    users!: User[];

    @Column({ default: false })
    canManagePages!: boolean;

    @Column({ default: false })
    canCreateNews!: boolean;

    @Column({ default: false })
    canEditNews!: boolean;

    @Column({ default: false })
    canDeleteNews!: boolean;

    @Column({ default: false })
    canCreateBook!: boolean;

    @Column({ default: false })
    canEditBook!: boolean;

    @Column({ default: false })
    canDeleteBook!: boolean;

    @Column({ default: false })
    canApprovePost!: boolean;

    @Column({ default: false })
    canManageAnnouncements!: boolean;

    @Column({ default: false })
    canManageUsers!: boolean;

    @Column({ default: false })
    canManageRoles!: boolean;

    @Column({ default: false })
    canManageGallery!: boolean;

    @Column({ default: false })
    canManageSlider!: boolean;


}
